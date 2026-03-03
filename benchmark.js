const fs = require('fs');
const { performance } = require('perf_hooks');

// Mock DOM
global.document = {
    getElementById: (id) => ({
        style: {},
        textContent: '',
        addEventListener: () => {},
        value: '',
        classList: {
            add: () => {},
            remove: () => {}
        }
    }),
    readyState: 'complete',
    addEventListener: () => {},
    querySelectorAll: () => [],
    querySelector: () => ({ classList: { add: () => {}, remove: () => {} }, getAttribute: () => '' }),
    body: {},
    dispatchEvent: () => {}
};
global.window = {
    addEventListener: () => {}
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};
global.NutritionCharts = {
    initialize: async () => {}
};
global.MealPlansGallery = class {
    async initialize() {}
};
global.RecipeCalculator = {
    initialize: async () => {}
};

// Mock rAF
let rAFCount = 0;
global.requestAnimationFrame = (cb) => {
    rAFCount++;
    setImmediate(cb);
};

global.CustomEvent = class {
    constructor(event, params) {
        this.event = event;
        this.params = params;
    }
};

const scriptCode = fs.readFileSync('./script.js', 'utf8');

const vm = require('vm');
vm.runInThisContext(scriptCode);

async function runBenchmark() {
    // Override setupEventListeners to avoid DOM dependencies that are too annoying to mock
    MealCalculator.prototype.setupEventListeners = async function() {};
    MealCalculator.prototype.updateNutritionDisplay = async function() {};

    const mc = new MealCalculator();

    // Wait for init
    await new Promise(r => setTimeout(r, 100));

    const totals = {
        calories: 1000,
        protein: 50,
        carbs: 100,
        fats: 30
    };

    // Warmup
    for (let i = 0; i < 100; i++) {
        await mc.updateProgressBars(totals);
    }

    rAFCount = 0;
    const start = performance.now();
    const iterations = 5000;

    for (let i = 0; i < iterations; i++) {
        await mc.updateProgressBars(totals);
    }

    const end = performance.now();
    const duration = end - start;

    console.log(`Benchmark completed in ${duration.toFixed(2)}ms`);
    console.log(`requestAnimationFrame calls: ${rAFCount}`);
    console.log(`Average time per call: ${(duration / iterations).toFixed(4)}ms`);
}

runBenchmark().catch(console.error);
