# Figma-to–Experience Cloud Agent

This document describes the **Figma-to-ExpCloud Agent**: a Cursor AI configuration that turns Figma designs into Salesforce Lightning Web Components (LWCs) for Experience Cloud, using the Figma MCP integration.

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

## Prerequisites

1. **Cursor** with the **Figma MCP** (official Figma MCP server) enabled and authenticated if your org requires it.
2. **Figma links** that include the node you want implemented (frame or component). The MCP server parses `fileKey` and `node-id` from standard Figma URLs.

When implementing from Figma, the agent should read the design through the MCP tools (for example `get_design_context` per server instructions) before generating code.

## Behavior summary

The following mirrors the numbered sections in `.cursor/rules/figma-agent.mdc`:

1. **Output** — Full LWC bundle: `.html`, `.js`, `.js-meta.xml`, and `.css` only when custom CSS is required for a pixel match. **Naming:** strict `camelCase` from the Figma frame/node name; no hyphens or underscores in folder or file names.

2. **Layout and styling** — Use **exact** pixel values from Figma. Do not round or substitute SLDS classes when their tokens do not match. Render only what exists in Figma (e.g. a rectangle stays a `<div>`; do not add `<lightning-input>` unless it is truly specified).

3. **JavaScript** — Bare minimum. If the prompt explicitly lists stubs, only those; otherwise infer from interactive layers in Figma. Each empty method must contain:  
   `// This is kept empty due to not having enough info. `  
   No Apex, `@wire`, or mock data unless you explicitly extend the rule later.

4. **Metadata** — `js-meta.xml` exposes the component for Experience Cloud: `isExposed`, targets `lightningCommunity__Page` and `lightningCommunity__Default`, API version `60.0` (or newer if you standardize on a later release). If the prompt explicitly lists strings to expose, use that list; otherwise expose primary copy via `@api` and `<property>` in `targetConfigs`.

5. **Assets** — The agent picks PowerShell vs `curl` from runtime context (no prompting the user) and may retry with the alternate command if the first fetch fails. **Small SVG (response body ≤ 10 KB):** may inline `<svg>` in HTML after fetch. **Larger SVG:** do not inline; use `<img>` / CSS URL like PNG/JPG and expose URLs in metadata. **Raster:** Figma URLs in markup/CSS; expose in Builder per section 6.

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

*Last aligned with `.cursor/rules/figma-agent.mdc` — if the rule and this file disagree, trust the rule file until this document is updated.*
