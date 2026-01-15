// Recipe Calculator for Indian Meal Calculator
// Define and initialize Recipe Calculator
class RecipeCalculator {
    constructor() {
        this.recipes = [];
        this.currentRecipe = null;
        // Don't call init() in constructor, let initialize() handle it
    }

    static async initialize() {
        try {
            // Wait for DOM to be fully loaded
            if (document.readyState !== 'complete') {
                await new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
            }

            // Ensure document.body is available
            if (!document.body) {
                await new Promise(resolve => {
                    const checkBody = () => {
                        if (document.body) {
                            resolve();
                        } else {
                            requestAnimationFrame(checkBody);
                        }
                    };
                    checkBody();
                });
            }



            // Initialize instance if not already initialized
            if (!window.recipeCalculator) {
                const instance = new RecipeCalculator();
                await instance.init();
                window.recipeCalculator = instance;
                return instance;
            }
            return window.recipeCalculator;
        } catch (error) {
            console.error('Failed to initialize RecipeCalculator:', error);
            throw error;
        }
    }

    async init() {
        try {

            // Create modal and wait for it to be added to DOM
            await this.createRecipeModal();

            // Wait for modal elements to be available
            await new Promise(resolve => {
                const checkElements = () => {
                    this.modal = document.getElementById('recipe-modal');
                    this.ingredientsList = document.getElementById('ingredients-list');
                    if (this.modal && this.ingredientsList) {
                        resolve();
                    } else {
                        requestAnimationFrame(checkElements);
                    }
                };
                checkElements();
            });

            // Set up event listeners after all elements are created
            this.setupEventListeners();
            return this;
        } catch (error) {
            console.error('Failed to initialize recipe calculator:', error);
            throw error;
        }
    }

    async createRecipeModal() {
        return new Promise(resolve => {
            const modal = document.createElement('div');
            modal.id = 'recipe-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Create Recipe</h2>
                        <button class="close-button">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="recipe-form">
                            <input type="text" id="recipe-name" placeholder="Recipe Name" required>
                            <textarea id="recipe-description" placeholder="Recipe Description" rows="3"></textarea>
                            <div class="recipe-ingredients">
                                <h3>Ingredients</h3>
                                <div id="ingredients-list"></div>
                                <button id="add-ingredient" class="secondary-button">
                                    <i class="fas fa-plus"></i> Add Ingredient
                                </button>
                            </div>
                            <div class="recipe-instructions">
                                <h3>Instructions</h3>
                                <textarea id="recipe-instructions" placeholder="Cooking Instructions" rows="5"></textarea>
                            </div>
                            <div class="recipe-servings">
                                <label for="recipe-servings">Number of Servings:</label>
                                <input type="number" id="recipe-servings" min="1" value="4">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="save-recipe" class="primary-button">Save Recipe</button>
                        <button id="cancel-recipe" class="secondary-button">Cancel</button>
                    </div>
                </div>
            `;

            // Wait for next frame to ensure body is available
            requestAnimationFrame(() => {
                document.body.appendChild(modal);
                resolve();
            });
        });
    }

    setupEventListeners() {

        const modal = document.getElementById('recipe-modal');
        const closeButton = modal.querySelector('.close-button');
        const cancelButton = modal.querySelector('#cancel-recipe');
        const saveButton = modal.querySelector('#save-recipe');
        const addIngredientButton = modal.querySelector('#add-ingredient');

        closeButton.addEventListener('click', () => this.closeRecipeModal());
        cancelButton.addEventListener('click', () => this.closeRecipeModal());
        saveButton.addEventListener('click', () => this.saveRecipe());
        addIngredientButton.addEventListener('click', () => this.addIngredientField());

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeRecipeModal();
        });
    }

    openRecipeModal() {
        const modal = document.getElementById('recipe-modal');
        modal.style.display = 'block';
        this.resetForm();
        this.addIngredientField(); // Add first ingredient field
    }

    closeRecipeModal() {
        const modal = document.getElementById('recipe-modal');
        modal.style.display = 'none';
    }

    addIngredientField() {
        const ingredientsList = document.getElementById('ingredients-list');
        const ingredientDiv = document.createElement('div');
        ingredientDiv.className = 'ingredient-item';
        ingredientDiv.innerHTML = `
            <input type="text" class="ingredient-name" placeholder="Ingredient Name">
            <input type="number" class="ingredient-amount" placeholder="Amount" min="0" step="0.1">
            <select class="ingredient-unit">
                <option value="g">grams</option>
                <option value="ml">milliliters</option>
                <option value="tsp">teaspoons</option>
                <option value="tbsp">tablespoons</option>
                <option value="cup">cups</option>
                <option value="piece">pieces</option>
            </select>
            <button class="remove-ingredient"><i class="fas fa-times"></i></button>
        `;

        // Add remove button functionality
        const removeButton = ingredientDiv.querySelector('.remove-ingredient');
        removeButton.addEventListener('click', () => {
            if (ingredientsList.children.length > 1) {
                ingredientDiv.remove();
            }
        });

        ingredientsList.appendChild(ingredientDiv);
    }

    resetForm() {
        document.getElementById('recipe-name').value = '';
        document.getElementById('recipe-description').value = '';
        document.getElementById('recipe-instructions').value = '';
        document.getElementById('recipe-servings').value = '4';
        document.getElementById('ingredients-list').innerHTML = '';
    }

    async saveRecipe() {
        const name = document.getElementById('recipe-name').value.trim();
        const description = document.getElementById('recipe-description').value.trim();
        const instructions = document.getElementById('recipe-instructions').value.trim();
        const servings = parseInt(document.getElementById('recipe-servings').value);

        // Security: Input Validation to prevent Storage Exhaustion/DoS
        if (!name) {
            alert('Please enter a recipe name');
            return;
        }
        if (name.length > 100) {
            alert('Recipe name is too long (max 100 characters)');
            return;
        }
        if (description.length > 500) {
            alert('Description is too long (max 500 characters)');
            return;
        }
        if (instructions.length > 2000) {
            alert('Instructions are too long (max 2000 characters)');
            return;
        }
        if (isNaN(servings) || servings < 1 || servings > 100) {
            alert('Servings must be between 1 and 100');
            return;
        }

        const ingredients = [];
        const ingredientItems = document.querySelectorAll('.ingredient-item');

        for (const item of ingredientItems) {
            const ingredientName = item.querySelector('.ingredient-name').value.trim();
            const amount = parseFloat(item.querySelector('.ingredient-amount').value);
            const unit = item.querySelector('.ingredient-unit').value;

            if (!ingredientName || isNaN(amount)) {
                alert('Please fill in all ingredient fields');
                return;
            }

            // Search for ingredient in food database
            const searchResults = await window.mealCalculator.searchFoodsAPI(ingredientName);
            const ingredient = searchResults[0]; // Use first match

            if (!ingredient) {
                alert(`Could not find nutrition data for ${ingredientName}`);
                return;
            }

            ingredients.push({
                name: ingredientName,
                amount,
                unit,
                nutrients: ingredient.nutrients
            });
        }

        const recipe = {
            id: Date.now(),
            name,
            description,
            ingredients,
            instructions,
            servings,
            nutrients: this.calculateRecipeNutrition(ingredients, servings)
        };

        this.recipes.push(recipe);
        this.closeRecipeModal();
        this.addRecipeToMeal(recipe);
    }

    calculateRecipeNutrition(ingredients, servings) {
        const totalNutrients = {
            ENERC_KCAL: 0,
            PROCNT: 0,
            CHOCDF: 0,
            FAT: 0
        };

        ingredients.forEach(ingredient => {
            // Convert amounts to 100g equivalent
            let multiplier = 1;
            switch (ingredient.unit) {
                case 'g':
                    multiplier = ingredient.amount / 100;
                    break;
                case 'ml':
                    multiplier = ingredient.amount / 100;
                    break;
                case 'tsp':
                    multiplier = (ingredient.amount * 5) / 100;
                    break;
                case 'tbsp':
                    multiplier = (ingredient.amount * 15) / 100;
                    break;
                case 'cup':
                    multiplier = (ingredient.amount * 240) / 100;
                    break;
                case 'piece':
                    multiplier = ingredient.amount;
                    break;
            }

            // Add nutrients
            Object.keys(totalNutrients).forEach(nutrient => {
                totalNutrients[nutrient] += (ingredient.nutrients[nutrient] || 0) * multiplier;
            });
        });

        // Calculate per serving
        Object.keys(totalNutrients).forEach(nutrient => {
            totalNutrients[nutrient] = Math.round(totalNutrients[nutrient] / servings);
        });

        return totalNutrients;
    }

    addRecipeToMeal(recipe) {
        const currentMeal = window.mealCalculator.currentMeal;
        if (!currentMeal) {
            alert('Please select a meal first');
            return;
        }

        // Add recipe as a food item
        const recipeItem = {
            foodId: `recipe-${recipe.id}`,
            label: `${recipe.name} (Recipe)`,
            nutrients: recipe.nutrients,
            measure: '1 serving',
            quantity: 1
        };

        window.mealCalculator.addFoodItem(recipeItem);
        window.mealCalculator.updateNutritionDisplay();
    }
}

// Make RecipeCalculator available globally

window.RecipeCalculator = RecipeCalculator;
