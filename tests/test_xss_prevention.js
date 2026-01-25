
const fs = require('fs');
const path = require('path');

// Mock browser environment
global.window = {
    addEventListener: () => {},
    mealCalculator: null,
    nutritionCharts: { init: () => {} }
};
global.document = {
    body: {},
    getElementById: () => ({
        innerHTML: '',
        appendChild: () => {},
        querySelector: () => null,
        addEventListener: () => {},
        style: {}
    }),
    createElement: () => ({
        innerHTML: '',
        querySelector: () => null,
        classList: { add: () => {}, remove: () => {} },
        addEventListener: () => {}
    }),
    querySelectorAll: () => [],
    querySelector: () => ({ classList: { add: () => {}, remove: () => {} } }),
    addEventListener: () => {},
    readyState: 'loading',
    dispatchEvent: () => {}
};
global.requestAnimationFrame = (cb) => cb();
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};
global.navigator = { mediaDevices: {} };
global.CustomEvent = class CustomEvent {};
global.Date = class extends Date {
    static now() { return 1234567890; }
};
global.alert = () => {};

// Read script.js content
let scriptContent = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

// Append export to global
scriptContent += '\nglobal.MealCalculator = MealCalculator; global.escapeHtml = escapeHtml;';

// Execute script.js
try {
    eval(scriptContent);
} catch (e) {
    console.error("Error evaluating script.js:", e);
    process.exit(1);
}

// Test setup
async function testXSS() {
    if (typeof MealCalculator === 'undefined') {
        console.error("MealCalculator class not found.");
        process.exit(1);
    }

    const calc = new MealCalculator();

    // Malicious payload
    const maliciousItem = {
        id: '1',
        name: 'Safe Name',
        portion: '<img src=x onerror=alert("XSS_PORTION")>',
        unit: 'g',
        calories: '<img src=x onerror=alert("XSS_CALORIES")>',
        protein: '<img src=x onerror=alert("XSS_PROTEIN")>',
        carbs: 10,
        fats: 5
    };

    calc.meals.breakfast = [maliciousItem];

    // Mock document.getElementById to capture the output
    let capturedHTML = '';

    // We need to intercept the specific element
    const originalGetElementById = global.document.getElementById;
    global.document.getElementById = (id) => {
        if (id === 'breakfast-items') {
            return {
                set innerHTML(val) { capturedHTML = val; },
                get innerHTML() { return capturedHTML; },
                appendChild: (el) => { capturedHTML += el.innerHTML; }
            };
        }
        return originalGetElementById(id);
    };

    // Initialize/Run
    await calc.renderMealItems('breakfast');

    console.log('Captured HTML:', capturedHTML);

    let vulnerabilityFound = false;

    if (capturedHTML.includes('<img src=x onerror=alert("XSS_CALORIES")>')) {
        console.error('VULNERABILITY CONFIRMED: Calories not escaped');
        vulnerabilityFound = true;
    } else {
        console.log('Calories escaped correctly');
    }

    if (capturedHTML.includes('<img src=x onerror=alert("XSS_PORTION")>')) {
        console.error('VULNERABILITY CONFIRMED: Portion not escaped');
        vulnerabilityFound = true;
    } else {
        console.log('Portion escaped correctly');
    }

    if (vulnerabilityFound) {
        console.error("Overall status: VULNERABLE");
        process.exit(1);
    } else {
        console.log("Overall status: SAFE");
        process.exit(0);
    }
}

testXSS();
