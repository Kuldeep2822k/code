## 2024-05-22 - Content Security Policy Constraints
**Vulnerability:** Extensive use of `innerHTML` and inline event handlers in `script.js` and HTML files.
**Learning:** This architecture necessitates `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'` in CSP, significantly reducing the policy's effectiveness against XSS.
**Prevention:** In future refactors, move event handlers to JavaScript files using `addEventListener` and avoid `innerHTML` for user-controlled data to allow a stricter CSP.

## 2025-05-23 - DOM Event Handler Security
**Vulnerability:** The use of `onclick` attributes in `innerHTML` strings (e.g., `onclick="mealCalculator.removeItem('${item.id}')"`) creates an XSS vulnerability if the interpolated variables are controlled by an attacker.
**Learning:** Even with escaping, inline event handlers are risky and violate CSP best practices.
**Prevention:** Always attach event listeners programmatically using `addEventListener` after creating elements, which also keeps the data in the closure scope rather than exposing it in the HTML.

## 2025-05-23 - Stored XSS via Local Storage
**Vulnerability:** Data loaded from `localStorage` (specifically `portion` and nutritional values) was rendered into `innerHTML` without escaping, allowing Stored XSS if the storage was tampered with.
**Learning:** Never trust data from `localStorage`. Treat it as untrusted input just like network responses. Explicit validation upon load or strict escaping upon render (or both) is required.
**Prevention:** Apply `escapeHtml` to ALL variables interpolated into `innerHTML`, even those expected to be numbers, as their type is not guaranteed when loaded from storage.
