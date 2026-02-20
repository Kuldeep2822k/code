
import time
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
        # page.wait_for_load_state("networkidle") # May hang if API calls fail/retry
        time.sleep(2) # Simple wait for init

        # Add items via console
        print("Adding items...")
        page.evaluate("""
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
            window.mealCalculator.meals['breakfast'] = items;
            window.mealCalculator.renderMealItems('breakfast');
        """)

        # Wait a bit for RAF
        time.sleep(1)

        # Take screenshot of the breakfast section
        print("Taking screenshot...")
        # element = page.locator("#breakfast-items")
        # element.screenshot(path="verification/render_verify.png")

        # Take screenshot of the breakfast meal card
        # The id is 'breakfast' for the tab content, but 'breakfast-items' for the list
        # Let's verify what is visible.
        # The default tab might not be breakfast?
        # The code shows 'breakfast', 'morning-snack', 'lunch' etc. are displayed in cards?
        # Let's check index.html structure.

        # Actually I should ensure 'breakfast' is visible.
        # But 'renderMealItems' populates the container regardless of visibility?
        # The container is `#breakfast-items`.

        page.screenshot(path="verification/full_page.png")

        # Try to locate the items
        items = page.locator("#breakfast-items .meal-item")
        count = items.count()
        print(f"Found {count} items.")

        if count > 0:
             page.locator("#breakfast-items").screenshot(path="verification/render_verify.png")

        browser.close()

if __name__ == "__main__":
    verify_render()
