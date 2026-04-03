/* ASSET REPLACEMENT TODO:
 * 1. logoMarkUrl    — Salesforce cloud logo mark (header):  https://www.figma.com/api/mcp/asset/2964d090-0e06-4348-969e-d8bd39755e5f
 * 2. logoWordmarkUrl — Salesforce text wordmark (header):   https://www.figma.com/api/mcp/asset/3f9c4d14-8f2e-45f8-9c6c-66c519b8e5e4
 * 3. commandIconUrl — Blue brand square icon (command):     https://www.figma.com/api/mcp/asset/9b281ebf-cc11-4ba5-8c1d-ab475383fdd0
 * 4. appleIconUrl   — Apple logo (Login with Apple btn):    https://www.figma.com/api/mcp/asset/7e428880-3444-428a-8304-be79109fb1f1
 * 5. googleIconUrl  — Google "G" logo (Login with Google):  https://www.figma.com/api/mcp/asset/dae39cd4-7c6b-492b-98db-a8ea65528c3a
 * 6. footerCloudUrl — Salesforce cloud icon (footer divider): https://www.figma.com/api/mcp/asset/b7951910-0d55-4eee-84be-14b43eac44fc
 * 7. docsIconUrl    — Book-open-text icon (Docs link):      https://www.figma.com/api/mcp/asset/2f3756e2-f8c7-49c8-b912-debc10b5019a
 * 8. globeIconUrl   — Globe icon (Website link):            https://www.figma.com/api/mcp/asset/d14967b8-56a7-444c-b993-feb156f01db4
 * 9. supportIconUrl — Badge-help icon (Support link):       https://www.figma.com/api/mcp/asset/9ff8c6ad-55c1-490f-a6a8-ed126057c913
 */
import { LightningElement, api } from 'lwc';

export default class Login3Page extends LightningElement {
    @api cardTitle = 'Welcome back';
    @api cardDescription = 'Login with your Apple or Google account';
    @api brandName = 'Market Street';

    logoMarkUrl = 'https://www.figma.com/api/mcp/asset/2964d090-0e06-4348-969e-d8bd39755e5f';
    logoWordmarkUrl = 'https://www.figma.com/api/mcp/asset/3f9c4d14-8f2e-45f8-9c6c-66c519b8e5e4';
    commandIconUrl = 'https://www.figma.com/api/mcp/asset/9b281ebf-cc11-4ba5-8c1d-ab475383fdd0';
    appleIconUrl = 'https://www.figma.com/api/mcp/asset/7e428880-3444-428a-8304-be79109fb1f1';
    googleIconUrl = 'https://www.figma.com/api/mcp/asset/dae39cd4-7c6b-492b-98db-a8ea65528c3a';
    footerCloudUrl = 'https://www.figma.com/api/mcp/asset/b7951910-0d55-4eee-84be-14b43eac44fc';
    docsIconUrl = 'https://www.figma.com/api/mcp/asset/2f3756e2-f8c7-49c8-b912-debc10b5019a';
    globeIconUrl = 'https://www.figma.com/api/mcp/asset/d14967b8-56a7-444c-b993-feb156f01db4';
    supportIconUrl = 'https://www.figma.com/api/mcp/asset/9ff8c6ad-55c1-490f-a6a8-ed126057c913';

    handleDocumentationClick(event) {
        // This is kept empty due to not having enough info. Do not implement anything based on assumption.
    }

    handleLoginWithAppleClick(event) {
        // This is kept empty due to not having enough info. Do not implement anything based on assumption.
    }

    handleLoginWithGoogleClick(event) {
        // This is kept empty due to not having enough info. Do not implement anything based on assumption.
    }

    handleLoginClick(event) {
        // This is kept empty due to not having enough info. Do not implement anything based on assumption.
    }

    handleForgotPasswordClick(event) {
        // This is kept empty due to not having enough info. Do not implement anything based on assumption.
    }

    handleSignUpClick(event) {
        // This is kept empty due to not having enough info. Do not implement anything based on assumption.
    }

    handleDocsClick(event) {
        // This is kept empty due to not having enough info. Do not implement anything based on assumption.
    }

    handleWebsiteClick(event) {
        // This is kept empty due to not having enough info. Do not implement anything based on assumption.
    }

    handleSupportClick(event) {
        // This is kept empty due to not having enough info. Do not implement anything based on assumption.
    }
}
