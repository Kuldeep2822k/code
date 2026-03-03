const fs = require('fs');

const ITERATIONS = 10;
const INGREDIENTS_COUNT = 5;

// Mock window and DOM
global.window = {};
global.document = {
    readyState: 'complete',
    body: { appendChild: () => {} },
    createElement: () => ({ innerHTML: '' }),
    getElementById: (id) => {
        if (id === 'recipe-name') return { value: 'Test Recipe' };
        if (id === 'recipe-description') return { value: 'Test Description' };
        if (id === 'recipe-instructions') return { value: 'Test Instructions' };
        if (id === 'recipe-servings') return { value: '4' };
        return { value: 'test' };
    },
    querySelectorAll: () => {
        return Array.from({ length: INGREDIENTS_COUNT }).map((_, i) => ({
            querySelector: (selector) => {
                if (selector === '.ingredient-name') return { value: `Ingredient ${i}` };
                if (selector === '.ingredient-amount') return { value: '1' };
                if (selector === '.ingredient-unit') return { value: 'g' };
                return { value: '' };
            }
        }));
    }
};

global.alert = () => {};
global.requestAnimationFrame = (cb) => cb();

// Mock the API to simulate network delay
global.window.mealCalculator = {
    searchFoodsAPI: async (query) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([{ nutrients: { ENERC_KCAL: 100 } }]);
            }, 50); // 50ms simulated network delay
        });
    },
    currentMeal: 'breakfast',
    addFoodItem: () => true,
    showMessage: () => {}
};

// Evaluate the recipe-calculator.js script inside this context
const code = fs.readFileSync('recipe-calculator.js', 'utf8');
eval(code);

async function runBenchmark(name, func) {
    console.log(`Running benchmark: ${name}`);

    // Warmup
    for (let i = 0; i < 2; i++) {
        await func();
    }

    const start = Date.now();
    for (let i = 0; i < ITERATIONS; i++) {
        await func();
    }
    const end = Date.now();

    const totalTime = end - start;
    const avgTime = totalTime / ITERATIONS;

    console.log(`Total time (${ITERATIONS} runs): ${totalTime}ms`);
    console.log(`Average time per run: ${avgTime}ms\n`);

    return avgTime;
}

async function main() {
    const calc = new window.RecipeCalculator();
    calc.recipes = [];

    // We need to temporarily mock closeRecipeModal and calculateRecipeNutrition
    // to just do nothing or return dummy so we only measure the async part.
    calc.closeRecipeModal = () => {};
    calc.calculateRecipeNutrition = () => ({});

    // Run benchmark with original implementation
    await runBenchmark('Original (Serial)', async () => {
        await calc.saveRecipe();
    });
}

main().catch(console.error);
