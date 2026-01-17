## 2024-05-22 - Content Security Policy Constraints
**Vulnerability:** Extensive use of `innerHTML` and inline event handlers in `script.js` and HTML files.
**Learning:** This architecture necessitates `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'` in CSP, significantly reducing the policy's effectiveness against XSS.
**Prevention:** In future refactors, move event handlers to JavaScript files using `addEventListener` and avoid `innerHTML` for user-controlled data to allow a stricter CSP.

## 2024-05-22 - Centralized Data Validation Adapter
**Vulnerability:** Inconsistent data entry points led to potential crashes (missing methods) and lack of input validation (DoS risk via long strings, logic errors via negative numbers).
**Learning:** Client-side apps often accumulate multiple ways to modify state (UI, URL, local storage, cross-module calls). Without a central gatekeeper, validation is often missed.
**Prevention:** Implemented `addFoodItem` as a centralized, secure adapter that validates all food item properties (types, length limits, non-negative numbers) before they enter the application state.
