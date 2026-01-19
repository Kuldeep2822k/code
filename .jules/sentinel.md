## 2024-05-22 - Content Security Policy Constraints
**Vulnerability:** Extensive use of `innerHTML` and inline event handlers in `script.js` and HTML files.
**Learning:** This architecture necessitates `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'` in CSP, significantly reducing the policy's effectiveness against XSS.
**Prevention:** In future refactors, move event handlers to JavaScript files using `addEventListener` and avoid `innerHTML` for user-controlled data to allow a stricter CSP.

## 2025-05-23 - Inline Event Handler XSS Vector
**Vulnerability:** `onclick` attributes constructed with string interpolation (`onclick="func('${var}')"`) are vulnerable to XSS even if `var` is HTML-escaped, because HTML entities are decoded before JavaScript execution.
**Learning:** HTML escaping functions like `escapeHtml` are designed for HTML content, not for attribute values that are interpreted as code.
**Prevention:** Never pass dynamic data to inline event handlers. Always use `addEventListener` or event delegation.
