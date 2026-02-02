## 2024-05-22 - Content Security Policy Constraints
**Vulnerability:** Extensive use of `innerHTML` and inline event handlers in `script.js` and HTML files.
**Learning:** This architecture necessitates `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'` in CSP, significantly reducing the policy's effectiveness against XSS.
**Prevention:** In future refactors, move event handlers to JavaScript files using `addEventListener` and avoid `innerHTML` for user-controlled data to allow a stricter CSP.

## 2025-05-23 - DOM Event Handler Security
**Vulnerability:** The use of `onclick` attributes in `innerHTML` strings (e.g., `onclick="mealCalculator.removeItem('${item.id}')"`) creates an XSS vulnerability if the interpolated variables are controlled by an attacker.
**Learning:** Even with escaping, inline event handlers are risky and violate CSP best practices.
**Prevention:** Always attach event listeners programmatically using `addEventListener` after creating elements, which also keeps the data in the closure scope rather than exposing it in the HTML.

## 2025-05-24 - Stored XSS via LocalStorage
**Vulnerability:** `localStorage` data was trusted implicitly and rendered via `innerHTML` without escaping numeric fields (calories, protein, etc.). Malicious strings stored in `localStorage` could execute arbitrary JS.
**Learning:** Data from `localStorage` must be treated as untrusted user input, just like network responses. Type assumptions (e.g., "calories is a number") are dangerous without explicit validation.
**Prevention:** Implement strict schema validation and type coercion when loading data from storage. Apply output encoding (`escapeHtml`) to ALL interpolated variables in HTML templates, even those expected to be numbers.
