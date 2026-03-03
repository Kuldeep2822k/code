const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Serve from file://
    const indexPath = path.join(__dirname, 'index.html');
    await page.goto(`file://${indexPath}`, { waitUntil: 'networkidle0' });

    // Inject benchmark logic
    const results = await page.evaluate(async () => {
        // Wait for mealCalculator to be ready
        await new Promise(resolve => {
            if (window.mealCalculator) resolve();
            else {
                const interval = setInterval(() => {
                    if (window.mealCalculator) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            }
        });

        // Populate with items
        const numItems = 1000;
        window.mealCalculator.meals['breakfast'] = Array.from({ length: numItems }).map((_, i) => ({
            id: `item-${i}`,
            name: `Test Item ${i}`,
            portion: 1,
            unit: 'serving',
            calories: 100,
            protein: 10,
            carbs: 10,
            fats: 10
        }));

        const container = document.getElementById('breakfast-items');

        const start = performance.now();
        await window.mealCalculator.renderMealItems('breakfast');
        const end = performance.now();

        return {
            timeMs: end - start,
            numItems,
            childCount: container ? container.children.length : -1
        };
    });

    console.log(`Rendered ${results.numItems} items in ${results.timeMs.toFixed(2)}ms (Resulting child count: ${results.childCount})`);

    await browser.close();
})();
