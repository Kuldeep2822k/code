
import os
from playwright.sync_api import sync_playwright

def verify_render():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Set localStorage to bypass tour and clear data
        page.add_init_script("""
            localStorage.setItem('hasSeenTour', 'true');
            localStorage.removeItem('mealCalculatorData');
        """)

        # Load the page
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/index.html")

        # Wait for initialization
        page.wait_for_function("typeof window.mealCalculator !== 'undefined' && window.mealCalculator.meals")

        # Add items via console and render
        print("Adding items...")
        page.evaluate("""
            async () => {
                if (!window.mealCalculator) throw new Error('MealCalculator not initialized');

                const items = [];
                for (let i = 0; i < 5; i++) {
                    items.push({
                        id: 'id_' + i,
                        name: 'Test Item ' + i,
                        portion: 100,
                        unit: 'g',
                        calories: 100 + i,
                        protein: 10,
                        carbs: 10,
                        fats: 10
                    });
                }
                // Direct mutation is used here for performance testing setup, as user flow is tested elsewhere
                window.mealCalculator.meals['breakfast'] = items;
                await window.mealCalculator.renderMealItems('breakfast');
            }
        """)

        # Wait for items to be present in the DOM
        page.wait_for_selector("#breakfast-items .meal-item")

        # Take screenshot of the breakfast section for manual verification if needed
        # These are git-ignored
        print("Taking screenshot...")
        page.locator("#breakfast-items").screenshot(path="verification/render_verify.png")

        count = page.locator("#breakfast-items .meal-item").count()
        print(f"Found {count} items.")

        if count != 5:
            raise Exception(f"Expected 5 items, found {count}")

        browser.close()

if __name__ == "__main__":
    verify_render()
