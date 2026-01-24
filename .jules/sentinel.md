## 2024-05-22 - Content Security Policy Constraints
**Vulnerability:** Extensive use of `innerHTML` and inline event handlers in `script.js` and HTML files.
**Learning:** This architecture necessitates `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'` in CSP, significantly reducing the policy's effectiveness against XSS.
**Prevention:** In future refactors, move event handlers to JavaScript files using `addEventListener` and avoid `innerHTML` for user-controlled data to allow a stricter CSP.

## 2025-05-23 - DOM Event Handler Security
**Vulnerability:** The use of `onclick` attributes in `innerHTML` strings (e.g., `onclick="mealCalculator.removeItem('${item.id}')"`) creates an XSS vulnerability if the interpolated variables are controlled by an attacker.
**Learning:** Even with escaping, inline event handlers are risky and violate CSP best practices.
**Prevention:** Always attach event listeners programmatically using `addEventListener` after creating elements, which also keeps the data in the closure scope rather than exposing it in the HTML.

## 2025-05-23 - State Management Integrity Bypass
**Vulnerability:** `meal-plans.js` bypassed the central state management method (`addFoodItem`) by directly pushing objects to the `meals` array. This bypassed input validation and ID generation logic, leading to inconsistent data structures (`label` vs `name`) that crashed downstream components (`charts.js`).
**Learning:** Helper scripts and plugins must strictly adhere to the application's public API for state modification. Direct access to internal data structures should be restricted or carefully reviewed.
**Prevention:** Enforce usage of service methods (like `addFoodItem`) for all data mutations. Ensure data consumers (like charts) handle potential schema variations robustly or enforce a strict schema at the entry point.
