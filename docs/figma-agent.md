# Figma-to–Experience Cloud Agent

This document describes the **Figma-to-ExpCloud Agent**: a Cursor AI configuration that turns Figma designs into Salesforce Lightning Web Components (LWCs) for Experience Cloud, using a Figma MCP integration.

## Purpose

The agent acts as a strict interpretation layer between Figma and Salesforce:

- **Visual fidelity first:** Match the design with exact measurements from Figma, not approximations from SLDS utilities.
- **Deployment-ready output:** Produce standard LWC bundles under `force-app/main/default/lwc/` that admins can place in Experience Builder.
- **No guessed behavior:** Minimal JavaScript, no invented Apex or auth flows; interactive layers get empty stubs only when the design implies them.

## Where it is defined

| Artifact | Location | Role |
|----------|----------|------|
| **Cursor rule** | [`.cursor/rules/figma-agent.mdc`](../.cursor/rules/figma-agent.mdc) | Source of truth for agent directives. Edited when you want to change behavior. |
| **User prompt template** | [`docs/prompts/figma-lwc-prompt.md`](prompts/figma-lwc-prompt.md) | Copy-paste template: specs, optional JS stub list, optional Builder text list, layout notes. |

The rule file uses:

- `alwaysApply: true` — guidance is available across the workspace.
- `globs: "force-app/main/default/lwc/**/*"` — extra relevance when working in LWC folders.

## Figma MCP: Standard API vs Local Bridge (rate limits)

Figma’s **REST API** (used by the standard `figma-context-mcp` server) is rate-limited. On free/Starter plans, **Tier 1** endpoints (file content, images) are often capped at **about 6 requests per month** per file/plan. After that, calls return `429 Too Many Requests`.

**Figma MCP Bridge** ([gethopp/figma-mcp-bridge](https://github.com/gethopp/figma-mcp-bridge)) avoids those limits by **not calling the REST API**. Instead:

| | Standard MCP (`figma-context-mcp`) | Figma MCP Bridge (`@gethopp/figma-mcp-bridge`) |
|---|-----------------------------------|-----------------------------------------------|
| **How it connects** | HTTP to `api.figma.com` with a personal access token | Local **WebSocket** on `localhost:1994` |
| **Data source** | Figma REST API | Figma **Plugin API** inside the desktop app |
| **Rate limits** | Yes (plan/token dependent) | **No** — reads design data locally from the open file |
| **Auth** | `FIGMA_API_KEY` in `mcp.json` | None — you must be logged into Figma and run the plugin |
| **Typical tools** | `get_figma_data`, `download_figma_images` | `get_node`, `get_selection`, `get_design_context`, `get_screenshot`, `save_screenshots` |
| **URL-only workflow** | Can pass any Figma URL + `fileKey` / `nodeId` | Plugin must be **running in the file** you want; use selection or node IDs |

The bridge is intended for the same agent workflow (read design → generate LWC) but requires Figma Desktop with the development plugin running in the target file.

### Configure MCP in Cursor

Edit your global MCP config (typically `%USERPROFILE%\.cursor\mcp.json` on Windows):

**Standard (API — rate limited):**

```json
{
  "mcpServers": {
    "Figma-Open": {
      "command": "npx",
      "args": ["-y", "figma-context-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "YOUR_FIGMA_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

**Bridge (local — no API rate limit):**

```json
{
  "mcpServers": {
    "figma-bridge": {
      "command": "npx",
      "args": ["-y", "@gethopp/figma-mcp-bridge"]
    }
  }
}
```

After changing `mcp.json`, **reload Cursor** (`Ctrl+Shift+P` → **Reload Window**) so the new server loads.

### One-time: install the Figma plugin

1. Download **`figma-mcp-bridge-v0.0.11.zip`** (or latest) from [releases](https://github.com/gethopp/figma-mcp-bridge/releases).
2. Extract the zip; locate `plugin/manifest.json`.
3. In **Figma Desktop**, open a file you can **edit** (development plugins are not available in view-only files).
4. **Plugins → Development → Import plugin from manifest…** and select that `manifest.json`.
5. Run **Figma MCP Bridge** from **Plugins → Development**. Confirm **WebSocket Connected** in the plugin panel.

For **view-only** shared files: duplicate to your drafts, or copy/paste frames into an editable file, then run the plugin there.

### Agent impact when using the bridge

- **Layout/text:** Bridge data includes `bounds`, `styles`, `characters`, `autoLayout`, `padding` — suitable for pixel-perfect rules; field names differ from REST `globalVars` / `layout_*` refs.
- **Images:** Bridge does not return Figma CDN URLs like `download_figma_images`; use `get_screenshot` or `save_screenshots` and wire assets as static resources or `@api` URLs per your process.
- **Workflow:** User opens the correct frame in Figma, runs the plugin, then prompts Cursor; agent uses `get_selection`, `get_node`, or `get_design_context` instead of `get_figma_data(fileKey, …)`.

## Prerequisites

1. **Cursor** with an MCP server configured (bridge recommended to avoid REST rate limits; see above).
2. **Figma Desktop** with **Figma MCP Bridge** plugin running in the file you are implementing (if using the bridge).
3. **Edit access** to the Figma file (or a duplicate/copy of the design in an editable file).
4. **Figma links** with `node-id` still help humans locate frames; with the bridge, the agent reads from the **open file + selection/node ID**, not from a remote URL alone.

When implementing from Figma, the agent should read the design through MCP tools (`get_design_context`, `get_node`, `get_selection`, etc.) before generating code.

## Behavior summary

The following mirrors the numbered sections in `.cursor/rules/figma-agent.mdc`:

1. **Output** — Full LWC bundle: `.html`, `.js`, `.js-meta.xml`, and `.css` only when custom CSS is required for a pixel match. **Naming:** strict `camelCase` from the Figma frame/node name; no hyphens or underscores in folder or file names.

2. **Layout and styling** — Use **exact** pixel values from Figma. Do not round or substitute SLDS classes when their tokens do not match. Render only what exists in Figma (e.g. a rectangle stays a `<div>`; do not add `<lightning-input>` unless it is truly specified).

3. **JavaScript** — Bare minimum. If the prompt explicitly lists stubs, only those; otherwise infer from interactive layers in Figma. Each empty method must contain:  
   `// This is kept empty due to not having enough info. `  
   No Apex, `@wire`, or mock data unless you explicitly extend the rule later.

4. **Metadata** — `js-meta.xml` exposes the component for Experience Cloud: `isExposed`, targets `lightningCommunity__Page` and `lightningCommunity__Default`, API version `60.0` (or newer if you standardize on a later release). If the prompt explicitly lists strings to expose, use that list; otherwise expose primary copy via `@api` and `<property>` in `targetConfigs`.

5. **Assets** — The agent picks PowerShell vs `curl` from runtime context (no prompting the user) and may retry with the alternate command if the first fetch fails. **Small SVG (response body ≤ 10 KB):** may inline `<svg>` in HTML after fetch. **Larger SVG:** do not inline; use `<img>` / CSS URL like PNG/JPG and expose URLs in metadata. **Raster:** use exported/screenshot URLs or static resources; expose in Builder per section 6. With the bridge, prefer `save_screenshots` over REST image URLs.

6. **Images in Builder** — Every image URL that should be editable in Experience Builder is exposed as an `@api` property and a `<property>` under `targetConfigs` for `lightningCommunity__Default`, so admins can point to Static Resources or CMS URLs.

## How to request a component

1. Open [`docs/prompts/figma-lwc-prompt.md`](prompts/figma-lwc-prompt.md).
2. Fill in the Figma link, **camelCase** component name, and portal context. Optionally list **JS stubs only** or **Builder text properties only**; leave those sections blank to let the agent infer from the design and default text rules.
3. Add layout notes as needed.
4. Paste into Cursor chat (optionally with `@figma-agent` or your usual way of invoking the rule).
5. Deploy the generated bundle with your normal Salesforce DX workflow and add the component to an Experience Builder page.

## Maintaining the agent

- **Change behavior:** Edit [`.cursor/rules/figma-agent.mdc`](../.cursor/rules/figma-agent.mdc), then update this doc if you add new sections or change prerequisites.
- **Change the prompt template:** Edit [`docs/prompts/figma-lwc-prompt.md`](prompts/figma-lwc-prompt.md) for consistent instructions to collaborators.

## Related project assets

- Sample Experience Cloud site metadata under `force-app/main/default/digitalExperiences/` (for example sites named for Figma agent work) is separate from the LWC rule; deploy and wire LWCs as your process requires.

---

## Quick tip: use the bridge (3 steps)

1. **MCP** — In `~/.cursor/mcp.json`, use `figma-bridge` with `@gethopp/figma-mcp-bridge`[https://github.com/gethopp/figma-mcp-bridge] (no API key). Reload Cursor.
2. **Figma** — Open your editable file → run **Plugins → Development → Figma MCP Bridge** → wait for **WebSocket Connected**.
3. **Cursor** — Select the frame in Figma, then ask the agent to build the LWC from the current selection or node ID.

---

*Last aligned with `.cursor/rules/figma-agent.mdc` — if the rule and this file disagree, trust the rule file until this document is updated.*
