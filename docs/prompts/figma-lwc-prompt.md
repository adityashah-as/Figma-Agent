@figma-agent Please read this design via your Figma MCP tool and generate the Experience Cloud LWC according to your strict rules.

### 1. Component specifications
* **Figma link:** [PASTE LINK HERE]
* **Component name:** [e.g., larkinCustomLogin] (must use strict camelCase)
* **Portal context:** [e.g., Larkin B2B Partner Portal]

### 2. JS method stubs (optional)
* **Leave this section empty** if you want the agent to infer empty click handlers from interactive layers in the Figma file (buttons, links, etc.).
* **Or list** only the interactions you want stubbed (by control name or desired handler name). The agent will create **only** what you list here, not the full inferred set.

Examples (delete if using auto):
* [e.g., "Log In" button → `handleLogInClick`]
* [e.g., "Forgot Password?" link]
* [e.g., "Sign in with SSO" button]

### 3. Text / labels as Experience Builder properties (optional)
* **Leave this section empty** if you want the agent to pick primary headers and main descriptive copy per the rule.
* **Or list** each piece of copy that should be an `@api` string editable in Experience Builder (by Figma layer name or exact default text). The agent will expose **only** what you list (image properties still follow the rule for assets).

Examples (delete if using auto):
* [e.g., Hero title]
* [e.g., Subtitle under the form]
* [e.g., Footer legal line]

### 4. Interactive elements reference (optional)
If you already filled **section 2**, you can skip this. Otherwise you may repeat or clarify interactive layers here for the agent’s inference:

* [e.g., "Log In" Button]
* [e.g., "Forgot Password?" Text Link]
* [e.g., "Sign in with SSO" Button]

### 5. Layout & Scrolling Behavior (CHOOSE ONE)
Please build the macro-layout of this component using the following behavior:
* [ ] **App-like / Dashboard:** Lock to screen height (`100vh`), do NOT allow the main page to scroll (`overflow: hidden`). If internal sections need scrolling, apply `overflow-y: auto` only to those specific inner containers (e.g., a Sidebar or fixed Navigation).
* [ ] **Document-like / Standard Page:** Allow the component to grow to its natural height. Do NOT restrict the height to `vh` and allow the browser window to scroll normally (e.g., an About Page, Article, or long Form).

### 6. Extra layout notes
* [Add any other specific instructions here, e.g., "Make sure the background color stretches full width"]
