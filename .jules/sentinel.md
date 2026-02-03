## 2024-05-22 - Content Security Policy Constraints
**Vulnerability:** Extensive use of `innerHTML` and inline event handlers in `script.js` and HTML files.
**Learning:** This architecture necessitates `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'` in CSP, significantly reducing the policy's effectiveness against XSS.
**Prevention:** In future refactors, move event handlers to JavaScript files using `addEventListener` and avoid `innerHTML` for user-controlled data to allow a stricter CSP.

## 2025-05-23 - DOM Event Handler Security
**Vulnerability:** The use of `onclick` attributes in `innerHTML` strings (e.g., `onclick="mealCalculator.removeItem('${item.id}')"`) creates an XSS vulnerability if the interpolated variables are controlled by an attacker.
**Learning:** Even with escaping, inline event handlers are risky and violate CSP best practices.
**Prevention:** Always attach event listeners programmatically using `addEventListener` after creating elements, which also keeps the data in the closure scope rather than exposing it in the HTML.

## 2025-05-23 - LocalStorage Data Sanitization
**Vulnerability:** Data loaded from `localStorage` was blindly trusted and rendered into the DOM, creating a Stored XSS vulnerability.
**Learning:** `localStorage` is not a trusted source; it can be manipulated by attackers or malicious scripts. Relying on JSON structure without type validation is dangerous.
**Prevention:** Always validate and sanitize data retrieved from `localStorage` before using it. Enforce types (e.g., ensuring numbers are numbers) and escape data before rendering.
