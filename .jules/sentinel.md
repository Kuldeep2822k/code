## 2024-05-22 - Content Security Policy Constraints
**Vulnerability:** Extensive use of `innerHTML` and inline event handlers in `script.js` and HTML files.
**Learning:** This architecture necessitates `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'` in CSP, significantly reducing the policy's effectiveness against XSS.
**Prevention:** In future refactors, move event handlers to JavaScript files using `addEventListener` and avoid `innerHTML` for user-controlled data to allow a stricter CSP.

## 2025-05-23 - DOM Event Handler Security
**Vulnerability:** The use of `onclick` attributes in `innerHTML` strings (e.g., `onclick="mealCalculator.removeItem('${item.id}')"`) creates an XSS vulnerability if the interpolated variables are controlled by an attacker.
**Learning:** Even with escaping, inline event handlers are risky and violate CSP best practices.
**Prevention:** Always attach event listeners programmatically using `addEventListener` after creating elements, which also keeps the data in the closure scope rather than exposing it in the HTML.

## 2025-05-24 - Data Structure Consistency and Validation Bypass
**Vulnerability:** `loadMealPlan` in `meal-plans.js` bypassed the central `addFoodItem` validation method and manually pushed objects with incorrect structure (using `label` instead of `name`, nested `nutrition` object) into the application state.
**Learning:** Hardcoded data or "trusted" sources must still adhere to the application's data contracts and validation rules. Duplicated code or orphan code blocks can mislead developers into deleting necessary logic (like CSS styles) if not carefully analyzed.
**Prevention:** Always use the primary mutation methods (like `addFoodItem`) even for internal data loading. Verify that "orphan" code is truly unused before deletion.
