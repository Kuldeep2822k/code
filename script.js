// Meal Calculator Application

// Utility for XSS prevention
function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// USDA Food Database API (free, no key required for basic usage)
const USDA_API_URL = 'https://api.nal.usda.gov/fdc/v1';

// Clarifai API for food recognition (you'll need to get a free API key)
const CLARIFAI_API_KEY = 'YOUR_CLARIFAI_API_KEY';
const CLARIFAI_FOOD_MODEL_ID = 'bd367be194cf45149e75f01d59f77ba7';

class MealCalculator {
    constructor() {
        this.meals = {
            'breakfast': [],
            'morning-snack': [],
            'lunch': [],
            'afternoon-snack': [],
            'dinner': [],
            'evening-snack': []
        };
        this.dailyGoals = {
            calories: 2000,
            protein: 150,
            carbs: 250,
            fats: 67
        };
        this.currentMeal = '';
        this.selectedFood = null;
        this.init();

        // Image capture state
        this.imageCaptureStream = null;
        this.capturedImageData = null;
        this.isCapturing = false;
    }

    getFoodDatabase() {
        // Return an empty object or sample local food database
        return {};
    }

    getIndianFoodsDatabase(query) {
        // Comprehensive Indian foods database with nutrition information
        const indianFoods = [
            // Rice and Grains
            { foodId: 'indian-1', label: 'Basmati Rice, cooked', nutrients: { ENERC_KCAL: 130, PROCNT: 2.7, CHOCDF: 28, FAT: 0.3 }, measure: '100g' },
            { foodId: 'indian-2', label: 'Brown Rice, cooked', nutrients: { ENERC_KCAL: 111, PROCNT: 2.6, CHOCDF: 23, FAT: 0.9 }, measure: '100g' },
            { foodId: 'indian-3', label: 'Roti/Chapati', nutrients: { ENERC_KCAL: 264, PROCNT: 9, CHOCDF: 46, FAT: 4.2 }, measure: '100g' },
            { foodId: 'indian-4', label: 'Naan Bread', nutrients: { ENERC_KCAL: 310, PROCNT: 8, CHOCDF: 52, FAT: 6.5 }, measure: '100g' },
            { foodId: 'indian-5', label: 'Paratha', nutrients: { ENERC_KCAL: 326, PROCNT: 6.5, CHOCDF: 45, FAT: 12 }, measure: '100g' },
            { foodId: 'indian-6', label: 'Dosa', nutrients: { ENERC_KCAL: 133, PROCNT: 4.2, CHOCDF: 24, FAT: 2.1 }, measure: '100g' },
            { foodId: 'indian-7', label: 'Idli', nutrients: { ENERC_KCAL: 39, PROCNT: 2.2, CHOCDF: 7.5, FAT: 0.2 }, measure: '100g' },
            { foodId: 'indian-8', label: 'Upma', nutrients: { ENERC_KCAL: 156, PROCNT: 4.8, CHOCDF: 28, FAT: 2.8 }, measure: '100g' },
            
            // Lentils and Pulses
            { foodId: 'indian-9', label: 'Dal (Lentils), cooked', nutrients: { ENERC_KCAL: 116, PROCNT: 9, CHOCDF: 20, FAT: 0.4 }, measure: '100g' },
            { foodId: 'indian-10', label: 'Rajma (Kidney Beans)', nutrients: { ENERC_KCAL: 127, PROCNT: 8.7, CHOCDF: 23, FAT: 0.5 }, measure: '100g' },
            { foodId: 'indian-11', label: 'Chana Dal', nutrients: { ENERC_KCAL: 164, PROCNT: 8.9, CHOCDF: 27, FAT: 2.6 }, measure: '100g' },
            { foodId: 'indian-12', label: 'Moong Dal', nutrients: { ENERC_KCAL: 105, PROCNT: 7.5, CHOCDF: 19, FAT: 0.4 }, measure: '100g' },
            { foodId: 'indian-13', label: 'Toor Dal', nutrients: { ENERC_KCAL: 139, PROCNT: 7.8, CHOCDF: 25, FAT: 0.4 }, measure: '100g' },
            
            // Curries and Main Dishes
            { foodId: 'indian-14', label: 'Chicken Curry', nutrients: { ENERC_KCAL: 162, PROCNT: 18, CHOCDF: 8, FAT: 7.2 }, measure: '100g' },
            { foodId: 'indian-15', label: 'Butter Chicken', nutrients: { ENERC_KCAL: 280, PROCNT: 16, CHOCDF: 12, FAT: 18 }, measure: '100g' },
            { foodId: 'indian-16', label: 'Paneer Tikka', nutrients: { ENERC_KCAL: 265, PROCNT: 18, CHOCDF: 8, FAT: 18 }, measure: '100g' },
            { foodId: 'indian-17', label: 'Palak Paneer', nutrients: { ENERC_KCAL: 142, PROCNT: 8.5, CHOCDF: 6, FAT: 10 }, measure: '100g' },
            { foodId: 'indian-18', label: 'Aloo Gobi', nutrients: { ENERC_KCAL: 98, PROCNT: 3.2, CHOCDF: 16, FAT: 3.1 }, measure: '100g' },
            { foodId: 'indian-19', label: 'Baingan Bharta', nutrients: { ENERC_KCAL: 76, PROCNT: 2.8, CHOCDF: 12, FAT: 2.1 }, measure: '100g' },
            { foodId: 'indian-20', label: 'Chana Masala', nutrients: { ENERC_KCAL: 164, PROCNT: 8.9, CHOCDF: 27, FAT: 2.6 }, measure: '100g' },
            { foodId: 'indian-21', label: 'Dal Makhani', nutrients: { ENERC_KCAL: 198, PROCNT: 9.2, CHOCDF: 28, FAT: 6.8 }, measure: '100g' },
            { foodId: 'indian-22', label: 'Fish Curry', nutrients: { ENERC_KCAL: 145, PROCNT: 20, CHOCDF: 6, FAT: 5.2 }, measure: '100g' },
            { foodId: 'indian-23', label: 'Mutton Curry', nutrients: { ENERC_KCAL: 185, PROCNT: 22, CHOCDF: 8, FAT: 8.5 }, measure: '100g' },
            
            // Breads and Accompaniments
            { foodId: 'indian-24', label: 'Bhatura', nutrients: { ENERC_KCAL: 320, PROCNT: 7.5, CHOCDF: 48, FAT: 11 }, measure: '100g' },
            { foodId: 'indian-25', label: 'Poori', nutrients: { ENERC_KCAL: 360, PROCNT: 8.5, CHOCDF: 52, FAT: 14 }, measure: '100g' },
            { foodId: 'indian-26', label: 'Samosa', nutrients: { ENERC_KCAL: 262, PROCNT: 6.5, CHOCDF: 32, FAT: 12 }, measure: '100g' },
            { foodId: 'indian-27', label: 'Pakora', nutrients: { ENERC_KCAL: 245, PROCNT: 8.2, CHOCDF: 28, FAT: 11 }, measure: '100g' },
            { foodId: 'indian-28', label: 'Papadum', nutrients: { ENERC_KCAL: 371, PROCNT: 25, CHOCDF: 59, FAT: 1.4 }, measure: '100g' },
            
            // Sweets and Desserts
            { foodId: 'indian-29', label: 'Gulab Jamun', nutrients: { ENERC_KCAL: 320, PROCNT: 4.2, CHOCDF: 52, FAT: 10 }, measure: '100g' },
            { foodId: 'indian-30', label: 'Rasgulla', nutrients: { ENERC_KCAL: 186, PROCNT: 4.8, CHOCDF: 35, FAT: 2.1 }, measure: '100g' },
            { foodId: 'indian-31', label: 'Jalebi', nutrients: { ENERC_KCAL: 265, PROCNT: 3.2, CHOCDF: 48, FAT: 6.8 }, measure: '100g' },
            { foodId: 'indian-32', label: 'Kheer', nutrients: { ENERC_KCAL: 142, PROCNT: 3.8, CHOCDF: 24, FAT: 4.2 }, measure: '100g' },
            { foodId: 'indian-33', label: 'Ladoo', nutrients: { ENERC_KCAL: 385, PROCNT: 6.5, CHOCDF: 52, FAT: 16 }, measure: '100g' },
            
            // Beverages
            { foodId: 'indian-34', label: 'Masala Chai', nutrients: { ENERC_KCAL: 45, PROCNT: 1.2, CHOCDF: 8.5, FAT: 1.1 }, measure: '100ml' },
            { foodId: 'indian-35', label: 'Lassi', nutrients: { ENERC_KCAL: 98, PROCNT: 3.2, CHOCDF: 12, FAT: 4.1 }, measure: '100ml' },
            { foodId: 'indian-36', label: 'Buttermilk', nutrients: { ENERC_KCAL: 35, PROCNT: 3.5, CHOCDF: 4.8, FAT: 0.9 }, measure: '100ml' },
            
            // Snacks
            { foodId: 'indian-37', label: 'Bhel Puri', nutrients: { ENERC_KCAL: 156, PROCNT: 4.8, CHOCDF: 28, FAT: 2.8 }, measure: '100g' },
            { foodId: 'indian-38', label: 'Pani Puri', nutrients: { ENERC_KCAL: 142, PROCNT: 3.2, CHOCDF: 26, FAT: 2.1 }, measure: '100g' },
            { foodId: 'indian-39', label: 'Vada Pav', nutrients: { ENERC_KCAL: 285, PROCNT: 8.5, CHOCDF: 42, FAT: 9.8 }, measure: '100g' },
            { foodId: 'indian-40', label: 'Dahi Vada', nutrients: { ENERC_KCAL: 198, PROCNT: 6.8, CHOCDF: 32, FAT: 4.2 }, measure: '100g' },
            
            // Vegetables
            { foodId: 'indian-41', label: 'Bhindi Masala', nutrients: { ENERC_KCAL: 76, PROCNT: 3.8, CHOCDF: 12, FAT: 2.1 }, measure: '100g' },
            { foodId: 'indian-42', label: 'Gobi Manchurian', nutrients: { ENERC_KCAL: 185, PROCNT: 6.5, CHOCDF: 28, FAT: 6.2 }, measure: '100g' },
            { foodId: 'indian-43', label: 'Mushroom Curry', nutrients: { ENERC_KCAL: 89, PROCNT: 4.2, CHOCDF: 14, FAT: 2.8 }, measure: '100g' },
            { foodId: 'indian-44', label: 'Mixed Vegetable Curry', nutrients: { ENERC_KCAL: 98, PROCNT: 3.8, CHOCDF: 16, FAT: 2.5 }, measure: '100g' },
            
            // Rice Dishes
            { foodId: 'indian-45', label: 'Biryani', nutrients: { ENERC_KCAL: 285, PROCNT: 12, CHOCDF: 42, FAT: 8.5 }, measure: '100g' },
            { foodId: 'indian-46', label: 'Pulao', nutrients: { ENERC_KCAL: 198, PROCNT: 4.8, CHOCDF: 36, FAT: 3.2 }, measure: '100g' },
            { foodId: 'indian-47', label: 'Khichdi', nutrients: { ENERC_KCAL: 156, PROCNT: 6.8, CHOCDF: 28, FAT: 2.1 }, measure: '100g' },
            { foodId: 'indian-48', label: 'Fried Rice', nutrients: { ENERC_KCAL: 185, PROCNT: 4.2, CHOCDF: 32, FAT: 4.8 }, measure: '100g' }
        ];
        
        // Filter Indian foods based on query
        return indianFoods.filter(food => 
            food.label.toLowerCase().includes(query.toLowerCase())
        );
    }

    async init() {
        // Wait for DOM to be ready
        if (!document.body) {
            await new Promise(resolve => {
                window.addEventListener('DOMContentLoaded', resolve, { once: true });
            });
        }

        this.loadStoredData();
        await this.setupEventListeners();
        await this.updateNutritionDisplay();

        // Barcode scanner removed

        // Image capture elements
        this.imageCaptureStream = null;
        this.capturedImageData = null;
        this.isCapturing = false;

        // Initialize nutrition charts after DOM is ready
        if (window.nutritionCharts) {
            await window.nutritionCharts.init();
        }

        // Show initial tab
        const initialTab = document.querySelector('.tab-btn.active');
        if (initialTab) {
            await this.switchTab(initialTab.getAttribute('data-tab'));
        }
    }

    // Search foods using USDA API with focus on Indian foods (free, no key required)
    async searchFoodsAPI(query) {
        if (!query || query.length < 2) return [];

        try {
            // Use USDA Food Database API (free)
            const url = `${USDA_API_URL}/foods/search?api_key=DEMO_KEY&query=${encodeURIComponent(query)}&pageSize=25&dataType=Foundation,SR Legacy&sortBy=dataType.keyword&sortOrder=asc`;
            
            console.log('Searching USDA API for:', query);
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error('USDA API response not ok:', response.status, response.statusText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('USDA API response:', data);
            
            if (!data.foods || data.foods.length === 0) {
                console.log('No foods found in USDA API response');
                return [];
            }

            // Transform USDA data to our format
            const transformedFoods = data.foods.map(food => {
                const nutrients = {};
                if (food.foodNutrients) {
                    food.foodNutrients.forEach(nutrient => {
                        if (nutrient.nutrientName === 'Energy') {
                            nutrients.ENERC_KCAL = nutrient.value || 0;
                        } else if (nutrient.nutrientName === 'Protein') {
                            nutrients.PROCNT = nutrient.value || 0;
                        } else if (nutrient.nutrientName === 'Carbohydrate, by difference') {
                            nutrients.CHOCDF = nutrient.value || 0;
                        } else if (nutrient.nutrientName === 'Total lipid (fat)') {
                            nutrients.FAT = nutrient.value || 0;
                        }
                    });
                }
                
                return {
                    foodId: food.fdcId,
                    label: food.description,
                    nutrients: {
                        ENERC_KCAL: nutrients.ENERC_KCAL || 0,
                        PROCNT: nutrients.PROCNT || 0,
                        CHOCDF: nutrients.CHOCDF || 0,
                        FAT: nutrients.FAT || 0
                    },
                    measure: '100g'
                };
            });

            console.log('Transformed foods:', transformedFoods);
            return transformedFoods;

        } catch (error) {
            console.error('Error fetching food data:', error);
            
            // Fallback to a simpler search if USDA API fails
            try {
                console.log('Trying fallback API...');
                const fallbackUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=${encodeURIComponent(query)}&pageSize=10`;
                const fallbackResponse = await fetch(fallbackUrl);
                
                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    if (fallbackData.foods && fallbackData.foods.length > 0) {
                        console.log('Fallback API successful');
                        return fallbackData.foods.map(food => ({
                            foodId: food.fdcId,
                            label: food.description,
                            nutrients: {
                                ENERC_KCAL: 0,
                                PROCNT: 0,
                                CHOCDF: 0,
                                FAT: 0
                            },
                            measure: '100g'
                        }));
                    }
                }
            } catch (fallbackError) {
                console.error('Fallback API also failed:', fallbackError);
            }
            
            this.showMessage('Error fetching food data. Using Indian food database instead.', 'error');
            
            // Final fallback: return Indian foods database
            return this.getIndianFoodsDatabase(query);
        }
    }

    // Override searchFoods to use API
    async searchFoods(query) {
        const results = document.getElementById('food-results');
        results.innerHTML = '';

        if (!query || query.length < 2) {
            results.innerHTML = '<div class="food-result-item">Please enter at least 2 characters</div>';
            return;
        }

        // Security: Prevent DoS/API abuse with excessively long queries
        if (query.length > 100) {
            results.innerHTML = '<div class="food-result-item error">Search term too long (max 100 characters)</div>';
            return;
        }

        // Show loading state
        results.innerHTML = '<div class="food-result-item loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';

        const foods = await this.searchFoodsAPI(query);

        if (foods.length === 0) {
            results.innerHTML = '<div class="food-result-item">No foods found. Try a different search term.</div>';
            return;
        }

        results.innerHTML = foods.map(food => {
            const calories = food.nutrients.ENERC_KCAL || 0;
            return `
                <div class="food-result-item">
                    <div class="food-content">
                        <div class="food-details">
                            <div class="food-name">${escapeHtml(food.label)}</div>
                            <div class="food-calories">${calories} kcal per 100g</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const foodItems = results.querySelectorAll('.food-result-item');
        foodItems.forEach((item, index) => {
            item.addEventListener('click', (event) => this.selectFoodAPI(foods[index], event));
        });
    }

    selectFoodAPI(food, event) {
        this.selectedFood = {
            key: food.foodId || food.uri,
            name: food.label,
            calories: food.nutrients.ENERC_KCAL || 0,
            protein: food.nutrients.PROCNT || 0,
            carbs: food.nutrients.CHOCDF || 0,
            fats: food.nutrients.FAT || 0,
            unit: '100g'
        };

        // Update UI
        document.querySelectorAll('.food-result-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');

        document.getElementById('selected-food-name').textContent = food.label;
        document.getElementById('portion-size').value = 100;
        document.getElementById('portion-unit').value = 'gram';

        this.updateNutritionPreview();
    }

    async setupEventListeners() {
        // Wait for DOM elements to be available
        await new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Modal close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    if (modal.id === 'food-selector-modal') {
                        this.closeFoodSelector();
                    } else if (modal.id === 'manual-barcode-modal') {
                        // removed
                    } else if (modal.id === 'image-capture-modal') {
                        this.closeImageCapture();
                    }
                }
            });
        });

        // Food search with debouncing
        let searchTimeout;
        document.getElementById('food-search').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchFoods(e.target.value);
            }, 300);
        });

        // Portion size changes
        document.getElementById('portion-size').addEventListener('input', () => {
            this.updateNutritionPreview();
        });
        document.getElementById('portion-unit').addEventListener('change', () => {
            this.updateNutritionPreview();
        });

        // Goal inputs
        ['goal-calories', 'goal-protein', 'goal-carbs', 'goal-fats'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.updateDailyGoals();
            });
        });

        // Image capture buttons
        document.getElementById('capture-image-btn').addEventListener('click', () => this.captureImage());
        document.getElementById('close-image-capture-btn').addEventListener('click', () => this.closeImageCapture());
        document.getElementById('retake-image-btn').addEventListener('click', () => this.retakeImage());
    }

    async switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Update nutrition display if switching to nutrition tab
        if (tabName === 'nutrition') {
            await this.updateNutritionDisplay();
            await this.updateMealBreakdown();
        }
    }

    showFoodSelector(mealType) {
        this.currentMeal = mealType;
        document.getElementById('food-selector-modal').style.display = 'block';
        document.getElementById('food-search').value = '';
        document.getElementById('food-search').focus();
        // Clear results initially
        document.getElementById('food-results').innerHTML = '<div class="food-result-item">Enter a food name to search...</div>';
    }

    closeFoodSelector() {
        document.getElementById('food-selector-modal').style.display = 'none';
        this.selectedFood = null;
        this.currentMeal = '';
        document.getElementById('selected-food-name').textContent = '-';
        document.getElementById('nutrition-preview').innerHTML = '';
    }

    convertPortionToGrams(portionSize, portionUnit) {
        let portionInGrams = portionSize;
        if (portionUnit === 'cup') {
            portionInGrams = portionSize * 240; // 1 cup = 240g (approximate)
        } else if (portionUnit === 'ounce') {
            portionInGrams = portionSize * 28.35; // 1 oz = 28.35g
        } else if (portionUnit === 'piece') {
            portionInGrams = portionSize * 100; // Assume 1 piece = 100g (approximate)
        } else if (portionUnit === 'tablespoon') {
            portionInGrams = portionSize * 15; // 1 tbsp = 15g (approximate)
        } else if (portionUnit === 'teaspoon') {
            portionInGrams = portionSize * 5; // 1 tsp = 5g (approximate)
        } else if (portionUnit === 'serving') {
            portionInGrams = portionSize * 100; // Assume 1 serving = 100g (approximate)
        }
        // For 'gram', use as is
        return portionInGrams;
    }

    updateNutritionPreview() {
        if (!this.selectedFood) return;

        const portionSize = parseFloat(document.getElementById('portion-size').value) || 0;
        const portionUnit = document.getElementById('portion-unit').value;

        // Convert portion size to grams for calculation
        const portionInGrams = this.convertPortionToGrams(portionSize, portionUnit);
        
        // Calculate nutrition per 100g basis
        const multiplier = portionInGrams / 100;
        const calories = Math.round(this.selectedFood.calories * multiplier);
        const protein = Math.round(this.selectedFood.protein * multiplier * 10) / 10;
        const carbs = Math.round(this.selectedFood.carbs * multiplier * 10) / 10;
        const fats = Math.round(this.selectedFood.fats * multiplier * 10) / 10;

        const preview = document.getElementById('nutrition-preview');
        preview.innerHTML = `
            <strong>Nutrition Preview (${portionSize} ${portionUnit}):</strong><br>
            Calories: ${calories} kcal<br>
            Protein: ${protein}g<br>
            Carbohydrates: ${carbs}g<br>
            Fats: ${fats}g
        `;
    }

    addSelectedFood() {
        if (!this.selectedFood || !this.currentMeal) return;

        const portionSize = parseFloat(document.getElementById('portion-size').value) || 1;
        const portionUnit = document.getElementById('portion-unit').value;

        // Convert portion size to grams for calculation
        const portionInGrams = this.convertPortionToGrams(portionSize, portionUnit);
        
        // Calculate nutrition per 100g basis
        const multiplier = portionInGrams / 100;

        const foodItem = {
            id: Date.now().toString(),
            name: this.selectedFood.name,
            portion: portionSize,
            unit: portionUnit,
            calories: Math.round(this.selectedFood.calories * multiplier),
            protein: Math.round(this.selectedFood.protein * multiplier * 10) / 10,
            carbs: Math.round(this.selectedFood.carbs * multiplier * 10) / 10,
            fats: Math.round(this.selectedFood.fats * multiplier * 10) / 10
        };

        this.meals[this.currentMeal].push(foodItem);
        this.renderMealItems(this.currentMeal);
        this.updateNutritionDisplay();
        this.saveData();
        this.closeFoodSelector();
        this.showMessage('Food item added successfully!', 'success');
    }

    /**
     * Securely adds a food item to the current meal with validation
     * @param {Object} item - The food item to add
     * @returns {boolean} - True if added successfully
     */
    addFoodItem(item) {
        if (!this.currentMeal) {
            this.showMessage('Please select a meal first', 'error');
            return false;
        }

        // Security: Input Validation
        if (!item || typeof item !== 'object') {
            console.error('Invalid item format');
            return false;
        }

        // Validate required fields
        const requiredFields = ['name', 'calories', 'protein', 'carbs', 'fats', 'portion', 'unit'];
        for (const field of requiredFields) {
            if (item[field] === undefined || item[field] === null) {
                console.error(`Missing field: ${field}`);
                return false;
            }
        }

        // Validate numeric values
        const numericFields = ['calories', 'protein', 'carbs', 'fats', 'portion'];
        for (const field of numericFields) {
            if (typeof item[field] !== 'number' || isNaN(item[field]) || item[field] < 0) {
                 this.showMessage(`Invalid value for ${field}`, 'error');
                 return false;
            }
        }

        // Ensure ID
        if (!item.id) {
            item.id = Date.now().toString();
        }

        this.meals[this.currentMeal].push(item);
        this.renderMealItems(this.currentMeal);
        this.updateNutritionDisplay();
        this.saveData();
        return true;
    }

    async renderMealItems(mealType) {
        const container = document.getElementById(`${mealType}-items`);
        if (!container) return;

        await new Promise(resolve => {
            requestAnimationFrame(() => {
        container.innerHTML = '';
                resolve();
            });
        });

        await Promise.all(this.meals[mealType].map(async item => {
            await new Promise(resolve => {
                requestAnimationFrame(() => {
            const itemElement = document.createElement('div');
            itemElement.className = 'meal-item';
            itemElement.innerHTML = `
                <div class="meal-item-info">
                    <div class="meal-item-name">${escapeHtml(item.name)}</div>
                    <div class="meal-item-details">${item.portion} ${escapeHtml(item.unit)}</div>
                </div>
                <div class="meal-item-nutrition">
                    <div class="meal-item-calories">${item.calories} kcal</div>
                    <div>P: ${item.protein}g | C: ${item.carbs}g | F: ${item.fats}g</div>
                </div>
                <button class="remove-item-btn" onclick="mealCalculator.removeItem('${mealType}', '${item.id}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(itemElement);
                    resolve();
        });
            });
        }));
    }

    async removeItem(mealType, itemId) {
        this.meals[mealType] = this.meals[mealType].filter(item => item.id !== itemId);
        await this.renderMealItems(mealType);
        await this.updateNutritionDisplay();
        this.saveData();
        this.showMessage('Food item removed', 'info');
    }

    calculateTotalNutrition() {
        const totals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
        
        Object.values(this.meals).forEach(meal => {
            meal.forEach(item => {
                totals.calories += item.calories;
                totals.protein += item.protein;
                totals.carbs += item.carbs;
                totals.fats += item.fats;
            });
        });

        return {
            calories: Math.round(totals.calories),
            protein: Math.round(totals.protein * 10) / 10,
            carbs: Math.round(totals.carbs * 10) / 10,
            fats: Math.round(totals.fats * 10) / 10
        };
    }

    getTotalNutrient(nutrientType) {
        // Helper method for charts.js to get total of a specific nutrient
        const totals = this.calculateTotalNutrition();
        
        switch(nutrientType) {
            case 'protein':
                return totals.protein;
            case 'carbs':
                return totals.carbs;
            case 'fat':
                return totals.fats;
            case 'calories':
                return totals.calories;
            default:
                return 0;
        }
    }

    async updateNutritionDisplay() {
        // Wait for DOM elements to be available
        await new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });

        const totals = this.calculateTotalNutrition();

        // Update nutrition cards
        const updateElements = async () => {
            return new Promise(resolve => {
                requestAnimationFrame(() => {
        document.getElementById('total-calories').textContent = totals.calories;
        document.getElementById('total-protein').textContent = totals.protein;
        document.getElementById('total-carbs').textContent = totals.carbs;
        document.getElementById('total-fats').textContent = totals.fats;
                    resolve();
                });
            });
        };

        await updateElements();
        await this.updateProgressBars(totals);
        
        // Render all meal items
        await Promise.all(Object.keys(this.meals).map(mealType => this.renderMealItems(mealType)));
        
        // Dispatch custom event for charts to update
        document.dispatchEvent(new CustomEvent('mealsUpdated'));
    }

    async updateProgressBars(totals) {
        const nutrients = ['calories', 'protein', 'carbs', 'fats'];
        
        await Promise.all(nutrients.map(async nutrient => {
            const current = totals[nutrient];
            const goal = this.dailyGoals[nutrient];
            const percentage = Math.min((current / goal) * 100, 100);
            
            await new Promise(resolve => {
                requestAnimationFrame(() => {
            const progressFill = document.getElementById(`${nutrient}-progress`);
            const progressText = document.getElementById(`${nutrient}-text`);
            
                    if (progressFill && progressText) {
            progressFill.style.width = `${percentage}%`;
            
            const unit = nutrient === 'calories' ? 'kcal' : 'g';
            progressText.textContent = `${current} / ${goal} ${unit}`;
            
            // Change color based on progress
            if (percentage >= 90) {
                progressFill.style.background = 'linear-gradient(90deg, #48bb78, #38a169)';
            } else if (percentage >= 50) {
                progressFill.style.background = 'linear-gradient(90deg, #667eea, #764ba2)';
            } else {
                progressFill.style.background = 'linear-gradient(90deg, #fc8181, #f56565)';
            }
                    }
                    resolve();
                });
            });
        }));
    }

    async updateMealBreakdown() {
        // Wait for DOM elements to be available
        await new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });

        const chart = document.getElementById('meal-breakdown-chart');
        if (!chart) return;

        await new Promise(resolve => {
            requestAnimationFrame(() => {
        chart.innerHTML = '';
                resolve();
            });
        });

        await Promise.all(Object.entries(this.meals).map(async ([mealType, items]) => {
            const mealCalories = items.reduce((sum, item) => sum + item.calories, 0);
            
            if (mealCalories > 0) {
                await new Promise(resolve => {
                    requestAnimationFrame(() => {
                const item = document.createElement('div');
                item.className = 'breakdown-item';
                item.innerHTML = `
                    <div class="breakdown-item-name">${escapeHtml(this.formatMealName(mealType))}</div>
                    <div class="breakdown-item-calories">${mealCalories} kcal</div>
                `;
                chart.appendChild(item);
                        resolve();
                    });
        });
            }
        }));
    }

    formatMealName(mealType) {
        return mealType.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    updateDailyGoals() {
        this.dailyGoals = {
            calories: parseInt(document.getElementById('goal-calories').value) || 2000,
            protein: parseInt(document.getElementById('goal-protein').value) || 150,
            carbs: parseInt(document.getElementById('goal-carbs').value) || 250,
            fats: parseInt(document.getElementById('goal-fats').value) || 67
        };
        
        this.updateNutritionDisplay();
        this.saveData();
    }

    saveGoals() {
        this.updateDailyGoals();
        this.showMessage('Daily goals saved successfully!', 'success');
    }

    setPreset(presetType) {
        let preset;
        
        switch (presetType) {
            case 'weight-loss':
                preset = { calories: 1500, protein: 120, carbs: 150, fats: 50 };
                break;
            case 'maintenance':
                preset = { calories: 2000, protein: 150, carbs: 250, fats: 67 };
                break;
            case 'muscle-gain':
                preset = { calories: 2500, protein: 200, carbs: 300, fats: 83 };
                break;
            case 'athletic':
                preset = { calories: 3000, protein: 250, carbs: 375, fats: 100 };
                break;
        }
        
        document.getElementById('goal-calories').value = preset.calories;
        document.getElementById('goal-protein').value = preset.protein;
        document.getElementById('goal-carbs').value = preset.carbs;
        document.getElementById('goal-fats').value = preset.fats;
        
        this.updateDailyGoals();
        this.showMessage(`${this.formatMealName(presetType)} preset applied!`, 'success');
    }

    clearAllMeals() {
        if (confirm('Are you sure you want to clear all meals? This action cannot be undone.')) {
            Object.keys(this.meals).forEach(mealType => {
                this.meals[mealType] = [];
            });
            this.updateNutritionDisplay();
            this.saveData();
            this.showMessage('All meals cleared', 'info');
        }
    }

    saveMealPlan() {
        const totals = this.calculateTotalNutrition();
        const mealPlan = {
            date: new Date().toLocaleDateString(),
            meals: this.meals,
            totals: totals,
            goals: this.dailyGoals
        };
        
        localStorage.setItem('mealPlan_' + Date.now(), JSON.stringify(mealPlan));
        this.showMessage('Meal plan saved to browser storage!', 'success');
    }

    exportMealPlan() {
        const totals = this.calculateTotalNutrition();
        const exportData = {
            date: new Date().toLocaleDateString(),
            meals: this.meals,
            totals: totals,
            goals: this.dailyGoals
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `meal-plan-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showMessage('Meal plan exported successfully!', 'success');
    }

    saveData() {
        const data = {
            meals: this.meals,
            goals: this.dailyGoals
        };
        localStorage.setItem('mealCalculatorData', JSON.stringify(data));
    }

    loadStoredData() {
        const stored = localStorage.getItem('mealCalculatorData');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.meals = data.meals || this.meals;
                this.dailyGoals = data.goals || this.dailyGoals;
                
                // Update goal inputs
                document.getElementById('goal-calories').value = this.dailyGoals.calories;
                document.getElementById('goal-protein').value = this.dailyGoals.protein;
                document.getElementById('goal-carbs').value = this.dailyGoals.carbs;
                document.getElementById('goal-fats').value = this.dailyGoals.fats;
            } catch (error) {
                console.error('Error loading stored data:', error);
            }
        }
    }

    showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        document.querySelector('.container').insertBefore(message, document.querySelector('.container').firstChild);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }

    // Barcode feature removed

    // Image Capture Methods
    openImageCapture() {
        const modal = document.getElementById('image-capture-modal');
        modal.style.display = 'block';
        
        // Reset state
        this.isCapturing = false;
        this.capturedImageData = null;
        
        // Show video container, hide preview
        document.getElementById('image-capture-video-container').style.display = 'block';
        document.getElementById('image-capture-preview-container').style.display = 'none';
        
        // Reset buttons
        document.getElementById('capture-image-btn').style.display = 'block';
        document.getElementById('retake-image-btn').style.display = 'none';

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Show loading state
            this.showMessage('Accessing camera...', 'info');
            
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment', // Use back camera if available
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            })
            .then(stream => {
                this.imageCaptureStream = stream;
                const video = document.getElementById('image-capture-video');
                video.srcObject = stream;
                
                // Wait for video to be ready
                video.onloadedmetadata = () => {
                    video.play();
                    this.isCapturing = true;
                    this.showMessage('Camera ready! Click "Capture" to take a photo.', 'success');
                };
                
                video.onerror = (error) => {
                    this.showMessage('Error playing video: ' + error.message, 'error');
                };
            })
            .catch(err => {
                console.error('Camera access error:', err);
                if (err.name === 'NotAllowedError') {
                    this.showMessage('Camera access denied. Please allow camera permissions and try again.', 'error');
                } else if (err.name === 'NotFoundError') {
                    this.showMessage('No camera found on this device.', 'error');
                } else {
                    this.showMessage('Error accessing camera: ' + err.message, 'error');
                }
            });
        } else {
            this.showMessage('Camera not supported in this browser', 'error');
        }
    }

    captureImage() {
        if (!this.isCapturing || !this.imageCaptureStream) {
            this.showMessage('Camera not ready. Please wait...', 'error');
            return;
        }

        const video = document.getElementById('image-capture-video');
        
        // Check if video is ready
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            this.showMessage('Video not ready. Please wait a moment and try again.', 'error');
            return;
        }

        try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            
            // Draw the video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            this.capturedImageData = canvas.toDataURL('image/jpeg', 0.8);

            // Show captured image preview
            const preview = document.getElementById('image-capture-preview');
            preview.src = this.capturedImageData;
            
            // Switch UI to preview mode
            document.getElementById('image-capture-video-container').style.display = 'none';
            document.getElementById('image-capture-preview-container').style.display = 'block';
            
            // Update buttons
            document.getElementById('capture-image-btn').style.display = 'none';
            document.getElementById('retake-image-btn').style.display = 'block';

            // Stop video stream
            this.stopVideoStream();

            this.showMessage('Image captured! Analyzing...', 'success');
            
            // Analyze the image for food recognition
            this.recognizeFoodFromImage(this.capturedImageData);
            
        } catch (error) {
            console.error('Error capturing image:', error);
            this.showMessage('Error capturing image. Please try again.', 'error');
        }
    }

    retakeImage() {
        // Reset to video mode
        this.capturedImageData = null;
        document.getElementById('image-capture-preview-container').style.display = 'none';
        document.getElementById('image-capture-video-container').style.display = 'block';
        
        // Update buttons
        document.getElementById('capture-image-btn').style.display = 'block';
        document.getElementById('retake-image-btn').style.display = 'none';
        
        // Restart camera
        this.openImageCapture();
    }

    stopVideoStream() {
        if (this.imageCaptureStream) {
            this.imageCaptureStream.getTracks().forEach(track => {
                track.stop();
            });
            this.imageCaptureStream = null;
        }
        this.isCapturing = false;
    }

    closeImageCapture() {
        const modal = document.getElementById('image-capture-modal');
        modal.style.display = 'none';

        // Stop video stream if still active
        this.stopVideoStream();

        // Reset UI
        document.getElementById('image-capture-video-container').style.display = 'block';
        document.getElementById('image-capture-preview-container').style.display = 'none';
        document.getElementById('capture-image-btn').style.display = 'block';
        document.getElementById('retake-image-btn').style.display = 'none';
        
        // Clear preview
        const preview = document.getElementById('image-capture-preview');
        preview.src = '';
        
        // Clear captured data
        this.capturedImageData = null;
    }

    async recognizeFoodFromImage(imageData) {
        this.showMessage('Recognizing food from image...', 'info');

        // For now, we'll use a simple approach since Clarifai requires API key
        // In a real implementation, you would integrate with a free food recognition API
        // or use a local model
        
        try {
            // Simulate food recognition with common foods
            // In a real app, you would send the image to an API
            const commonFoods = [
                { name: 'Apple', confidence: 0.85, calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
                { name: 'Banana', confidence: 0.78, calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
                { name: 'Chicken Breast', confidence: 0.72, calories: 165, protein: 31, carbs: 0, fats: 3.6 },
                { name: 'Rice', confidence: 0.68, calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
                { name: 'Bread', confidence: 0.65, calories: 265, protein: 9, carbs: 49, fats: 3.2 }
            ];

            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show recognized foods for selection
            this.showRecognizedFoods(commonFoods);
            
        } catch (error) {
            console.error('Error recognizing food:', error);
            this.showMessage('Error recognizing food. Please try manual search instead.', 'error');
        }
    }

    // Alternative: Use a free food recognition API (example with Imagga)
    async recognizeFoodFromImageWithAPI(imageData) {
        this.showMessage('Recognizing food from image...', 'info');

        try {
            // This is an example using Imagga API (you would need to sign up for free tier)
            // const response = await fetch('https://api.imagga.com/v2/tags', {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': 'Basic ' + btoa('your_api_key:your_api_secret')
            //     },
            //     body: new FormData()
            // });

            // For now, we'll use the simulated approach above
            this.recognizeFoodFromImage(imageData);
            
        } catch (error) {
            console.error('Error with food recognition API:', error);
            this.showMessage('Food recognition service unavailable. Please use manual search.', 'error');
        }
    }

    showRecognizedFoods(foods) {
        const container = document.getElementById('recognized-foods');
        container.innerHTML = '';

        foods.forEach(food => {
            const item = document.createElement('div');
            item.className = 'recognized-food-item';
            item.innerHTML = `
                <div class="food-name">${escapeHtml(food.name)}</div>
                <div class="food-confidence">Confidence: ${(food.confidence * 100).toFixed(1)}%</div>
                <div class="food-nutrition">${food.calories} kcal, ${food.protein}g protein</div>
            `;
            item.addEventListener('click', () => this.selectRecognizedFood(food));
            container.appendChild(item);
        });

        // Show modal for recognized foods
        document.getElementById('recognized-foods-modal').style.display = 'block';
    }

    selectRecognizedFood(food) {
        this.selectedFood = {
            key: food.name.toLowerCase().replace(/\s+/g, '-'),
            name: food.name,
            calories: food.calories || 0,
            protein: food.protein || 0,
            carbs: food.carbs || 0,
            fats: food.fats || 0,
            unit: '100g'
        };

        document.getElementById('selected-food-name').textContent = this.selectedFood.name;
        document.getElementById('portion-size').value = 100;
        document.getElementById('portion-unit').value = 'gram';
        this.updateNutritionPreview();

        // Close recognized foods modal
        document.getElementById('recognized-foods-modal').style.display = 'none';
        this.closeImageCapture();
        
        // Open food selector to confirm selection
        this.showFoodSelector(this.currentMeal || 'breakfast');
    }

    initBarcodeScanner() {
        if (this.scannerActive) return;

        const self = this;
        Quagga.CameraAccess.enumerateVideoDevices()
            .then(function(devices) {
                self.availableCameras = devices;
                if (devices.length > 0) {
                    self.currentCamera = 0;
                    self.startScanner(devices[0].deviceId);
                } else {
                    self.showMessage('No camera devices found', 'error');
                }
            })
            .catch(function(err) {
                self.showMessage('Error accessing camera: ' + err, 'error');
            });
    }

    startScanner(deviceId) {
        const self = this;
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#barcode-scanner'),
                constraints: {
                    width: 480,
                    height: 320,
                    facingMode: "environment",
                    deviceId: deviceId ? deviceId : undefined
                }
            },
            decoder: {
                readers: ["ean_reader", "upc_reader", "upc_e_reader"]
            }
        }, function(err) {
            if (err) {
                self.showMessage('Quagga init error: ' + err, 'error');
                return;
            }
            Quagga.start();
            self.scannerActive = true;
        });

        Quagga.onDetected(function(result) {
            if (result && result.codeResult && result.codeResult.code) {
                const code = result.codeResult.code;
                self.showMessage('Barcode detected: ' + code, 'success');
                self.closeBarcodeScanner();
                self.searchByBarcode(code);
            }
        });
    }

    stopBarcodeScanner() {
        if (this.scannerActive) {
            Quagga.stop();
            this.scannerActive = false;
        }
    }

    toggleCamera() {
        if (this.availableCameras.length <= 1) {
            this.showMessage('No other cameras available', 'info');
            return;
        }
        this.stopBarcodeScanner();
        this.currentCamera = (this.currentCamera + 1) % this.availableCameras.length;
        this.startScanner(this.availableCameras[this.currentCamera].deviceId);
    }

    manualBarcodeEntry() {
        this.closeBarcodeScanner();
        document.getElementById('manual-barcode-modal').style.display = 'block';
        document.getElementById('barcode-input').value = '';
        document.getElementById('barcode-input').focus();
    }

    closeManualBarcode() {
        document.getElementById('manual-barcode-modal').style.display = 'none';
    }

    async searchByBarcode(code) {
        this.closeManualBarcode();
        this.showMessage('Searching for barcode: ' + code, 'info');

        try {
            // First try USDA API for barcode search
            const usdaUrl = `${USDA_API_URL}/foods/search?api_key=DEMO_KEY&query=${encodeURIComponent(code)}&pageSize=5&dataType=Foundation,SR Legacy`;
            
            console.log('Searching USDA API for barcode:', code);
            const usdaResponse = await fetch(usdaUrl);
            
            if (usdaResponse.ok) {
                const usdaData = await usdaResponse.json();
                console.log('USDA barcode response:', usdaData);
                
                if (usdaData.foods && usdaData.foods.length > 0) {
                    const food = usdaData.foods[0];
                    const nutrients = {};
                    if (food.foodNutrients) {
                        food.foodNutrients.forEach(nutrient => {
                            if (nutrient.nutrientName === 'Energy') {
                                nutrients.ENERC_KCAL = nutrient.value || 0;
                            } else if (nutrient.nutrientName === 'Protein') {
                                nutrients.PROCNT = nutrient.value || 0;
                            } else if (nutrient.nutrientName === 'Carbohydrate, by difference') {
                                nutrients.CHOCDF = nutrient.value || 0;
                            } else if (nutrient.nutrientName === 'Total lipid (fat)') {
                                nutrients.FAT = nutrient.value || 0;
                            }
                        });
                    }
                    
                    this.selectedFood = {
                        key: food.fdcId,
                        name: food.description,
                        calories: nutrients.ENERC_KCAL || 0,
                        protein: nutrients.PROCNT || 0,
                        carbs: nutrients.CHOCDF || 0,
                        fats: nutrients.FAT || 0,
                        unit: '100g'
                    };

                    document.getElementById('selected-food-name').textContent = this.selectedFood.name;
                    document.getElementById('portion-size').value = 100;
                    document.getElementById('portion-unit').value = 'gram';
            this.updateNutritionPreview();
            document.getElementById('food-selector-modal').style.display = 'block';
                    
                    this.showMessage('Product found in USDA database!', 'success');
                    return;
                }
            }
            
            // If USDA doesn't find it, try Open Food Facts as fallback
            const offUrl = `https://world.openfoodfacts.org/api/v0/product/${code}.json`;
            console.log('Trying Open Food Facts API for barcode:', code);
            const offResponse = await fetch(offUrl);
            
            if (offResponse.ok) {
                const offData = await offResponse.json();
                console.log('Open Food Facts barcode response:', offData);
                
                if (offData.status === 1 && offData.product) {
                    const product = offData.product;
                    const nutriments = product.nutriments || {};
                    
                    // Handle energy values
                    let energyKcal = 0;
                    if (nutriments['energy-kcal_100g']) {
                        energyKcal = nutriments['energy-kcal_100g'];
                    } else if (nutriments['energy_100g']) {
                        energyKcal = nutriments['energy_100g'] / 4.184;
                    } else if (nutriments['energy-kj_100g']) {
                        energyKcal = nutriments['energy-kj_100g'] / 4.184;
                    }
                    
                    this.selectedFood = {
                        key: product.code || `off-${Date.now()}-${Math.random()}`,
                        name: product.product_name || product.generic_name || 'Unknown Product',
                        calories: Math.round(energyKcal * 10) / 10,
                        protein: nutriments['proteins_100g'] || 0,
                        carbs: nutriments['carbohydrates_100g'] || 0,
                        fats: nutriments['fat_100g'] || 0,
                        unit: '100g',
                        brand: product.brands || '',
                        image: product.image_front_url || product.image_url || ''
                    };

                    const selectedFoodName = this.selectedFood.brand ? `${this.selectedFood.name} (${this.selectedFood.brand})` : this.selectedFood.name;
                    document.getElementById('selected-food-name').textContent = selectedFoodName;
                    document.getElementById('portion-size').value = 100;
                    document.getElementById('portion-unit').value = 'gram';
                    this.updateNutritionPreview();
                    document.getElementById('food-selector-modal').style.display = 'block';
                    
                    this.showMessage('Product found in Open Food Facts!', 'success');
                    return;
                }
            }
            
            // If no product found in APIs, show error
            this.showMessage('No product found for barcode: ' + code, 'error');
            
        } catch (error) {
            console.error('Error searching by barcode:', error);
            this.showMessage('Error searching for barcode. Please try again.', 'error');
        }
    }
}

// Global functions for HTML onclick handlers
window.mealCalculator = null;

function showFoodSelector(mealType) {
    mealCalculator.showFoodSelector(mealType);
}

function closeFoodSelector() {
    mealCalculator.closeFoodSelector();
}

function searchFoods() {
    const query = document.getElementById('food-search').value;
    mealCalculator.searchFoods(query);
}

function addSelectedFood() {
    mealCalculator.addSelectedFood();
}

function saveGoals() {
    mealCalculator.saveGoals();
}

function setPreset(presetType) {
    mealCalculator.setPreset(presetType);
}

function clearAllMeals() {
    mealCalculator.clearAllMeals();
}

function saveMealPlan() {
    mealCalculator.saveMealPlan();
}

function exportMealPlan() {
    mealCalculator.exportMealPlan();
}

function openBarcodeScanner() {
    mealCalculator.openBarcodeScanner();
}

function closeBarcodeScanner() {
    mealCalculator.closeBarcodeScanner();
}

function toggleCamera() {
    mealCalculator.toggleCamera();
}

function manualBarcodeEntry() {
    mealCalculator.manualBarcodeEntry();
}

function closeManualBarcode() {
    mealCalculator.closeManualBarcode();
}

async function searchByBarcode() {
    const code = document.getElementById('barcode-input').value.trim();
    if (code) {
        await mealCalculator.searchByBarcode(code);
    }
}

function openImageCapture() {
    mealCalculator.openImageCapture();
}

function closeImageCapture() {
    mealCalculator.closeImageCapture();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize meal calculator first
        window.mealCalculator = new MealCalculator();
        await window.mealCalculator.init();
        
        // Initialize meal plans gallery
        const mealPlansGallery = new MealPlansGallery();
        await mealPlansGallery.initialize();
        
        // Initialize nutrition charts
        // The charts will handle their own container creation and visibility
        await NutritionCharts.initialize();
        
        // Initialize recipe calculator last
        await RecipeCalculator.initialize();
    
    // Add some sample data for demonstration
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
    setTimeout(() => {
        // You can uncomment these lines to add sample meals
        /*
        mealCalculator.meals.breakfast = [
            { id: '1', name: 'Oatmeal', portion: 1, unit: 'cup', calories: 389, protein: 17, carbs: 66, fats: 7 },
            { id: '2', name: 'Banana', portion: 1, unit: 'medium', calories: 89, protein: 1.1, carbs: 23, fats: 0.3 }
        ];
        mealCalculator.meals.lunch = [
            { id: '3', name: 'Chicken Breast', portion: 1, unit: '100g', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
            { id: '4', name: 'Rice (cooked)', portion: 1, unit: 'cup', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 }
        ];
        mealCalculator.updateNutritionDisplay();
        */
    }, 100);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modal
    if (e.key === 'Escape') {
        if (document.getElementById('food-selector-modal').style.display === 'block') {
            mealCalculator.closeFoodSelector();
        }
    }
    
    // Ctrl/Cmd + S to save meal plan
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        mealCalculator.saveMealPlan();
    }
});
