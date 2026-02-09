## 2024-05-22 - Content Security Policy Constraints
**Vulnerability:** Extensive use of `innerHTML` and inline event handlers in `script.js` and HTML files.
**Learning:** This architecture necessitates `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'` in CSP, significantly reducing the policy's effectiveness against XSS.
**Prevention:** In future refactors, move event handlers to JavaScript files using `addEventListener` and avoid `innerHTML` for user-controlled data to allow a stricter CSP.

## 2024-05-22 - Centralized Data Validation Adapter
**Vulnerability:** Inconsistent data entry points led to potential crashes (missing methods) and lack of input validation (DoS risk via long strings, logic errors via negative numbers).
**Learning:** Client-side apps often accumulate multiple ways to modify state (UI, URL, local storage, cross-module calls). Without a central gatekeeper, validation is often missed.
**Prevention:** Implemented `addFoodItem` as a centralized, secure adapter that validates all food item properties (types, length limits, non-negative numbers) before they enter the application state.
## 2025-05-23 - DOM Event Handler Security
**Vulnerability:** The use of `onclick` attributes in `innerHTML` strings (e.g., `onclick="mealCalculator.removeItem('${item.id}')"`) creates an XSS vulnerability if the interpolated variables are controlled by an attacker.
**Learning:** Even with escaping, inline event handlers are risky and violate CSP best practices.
**Prevention:** Always attach event listeners programmatically using `addEventListener` after creating elements, which also keeps the data in the closure scope rather than exposing it in the HTML.

## 2025-05-24 - Unvalidated LocalStorage Data
**Vulnerability:** The application blindly loaded data from `localStorage` without validation, trusting it to match the expected schema. This could allow Stored XSS (if escaping was missed) or DoS via huge strings/arrays if malicious data was injected.
**Learning:** `localStorage` is an untrusted input source just like network requests. Data persisting on the client side can be manipulated.
**Prevention:** Always implement a strict schema validation layer when loading data from `localStorage` or other client-side storage mechanisms.
