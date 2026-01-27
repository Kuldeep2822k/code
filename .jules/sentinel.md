## 2024-05-22 - Content Security Policy Constraints
**Vulnerability:** Extensive use of `innerHTML` and inline event handlers in `script.js` and HTML files.
**Learning:** This architecture necessitates `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'` in CSP, significantly reducing the policy's effectiveness against XSS.
**Prevention:** In future refactors, move event handlers to JavaScript files using `addEventListener` and avoid `innerHTML` for user-controlled data to allow a stricter CSP.

## 2025-05-23 - DOM Event Handler Security
**Vulnerability:** The use of `onclick` attributes in `innerHTML` strings (e.g., `onclick="mealCalculator.removeItem('${item.id}')"`) creates an XSS vulnerability if the interpolated variables are controlled by an attacker.
**Learning:** Even with escaping, inline event handlers are risky and violate CSP best practices.
**Prevention:** Always attach event listeners programmatically using `addEventListener` after creating elements, which also keeps the data in the closure scope rather than exposing it in the HTML.

## 2025-05-24 - Stored XSS via localStorage
**Vulnerability:** Data loaded from `localStorage` in `script.js` was trusted and interpolated directly into HTML strings in `renderMealItems`, assuming numeric fields were safe.
**Learning:** `localStorage` can be compromised by other vulnerabilities or malicious user action, making it an untrusted source. Type checks during input (e.g., `addFoodItem`) are insufficient if `localStorage` is modified directly.
**Prevention:** Treat all data from `localStorage` as untrusted strings and escape them using `escapeHtml` before rendering into `innerHTML`, even for fields expected to be numeric.
