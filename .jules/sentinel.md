## 2024-05-22 - Content Security Policy Constraints
**Vulnerability:** Extensive use of `innerHTML` and inline event handlers in `script.js` and HTML files.
**Learning:** This architecture necessitates `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'` in CSP, significantly reducing the policy's effectiveness against XSS.
**Prevention:** In future refactors, move event handlers to JavaScript files using `addEventListener` and avoid `innerHTML` for user-controlled data to allow a stricter CSP.

## 2024-05-23 - Centralized State Mutation Validation
**Vulnerability:** Direct array manipulation of `meals` state by external modules (like `meal-plans.js`) and UI handlers bypassed input validation.
**Learning:** In vanilla JS apps without strict state management libraries (like Redux), it's easy for state integrity to degrade via direct access.
**Prevention:** Implement a centralized "gatekeeper" method (like `addFoodItem`) that handles all validation, normalization, and state updates, and force all modules to use it.
