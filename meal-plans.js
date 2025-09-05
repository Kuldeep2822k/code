/**
 * meal-plans.js - Sample meal plans gallery for the Indian Meal Calculator
 * This script adds a gallery of sample meal plans for quick demos
 */

class MealPlansGallery {
    constructor() {
        this.mealPlans = [];
        // Initialize will be called from script.js
    }

    async initialize() {
        // Wait for DOM to be ready
        await new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });

        // Add styles for meal plans
        const style = document.createElement('style');
        style.textContent = `
            #meal-plans {
                display: none;
                padding: 20px;
            }
            .gallery-header {
                text-align: center;
                margin-bottom: 30px;
            }
            .gallery-header h2 {
                font-size: 24px;
                color: #333;
                margin-bottom: 10px;
            }
            .gallery-header p {
                color: #666;
                font-size: 16px;
            }
            .meal-plans-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                padding: 20px;
            }
            .meal-plan-card {
                background: white;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                padding: 20px;
                transition: transform 0.2s;
                cursor: pointer;
            }
            .meal-plan-card:hover {
                transform: translateY(-5px);
            }
            .meal-plan-card h3 {
                color: #333;
                margin-bottom: 15px;
                font-size: 18px;
            }
            .meal-plan-card p {
                color: #666;
                font-size: 14px;
                margin-bottom: 10px;
            }
            .meal-plan-card .nutrition-info {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #eee;
            }
            .meal-plan-card .nutrition-item {
                font-size: 14px;
                color: #555;
            }
        `;
        document.head.appendChild(style);

        // Add event listener for tab switching
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn[data-tab="meal-plans"]')) {
                // Hide all tab content
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.style.display = 'none';
                });
                // Show meal plans tab
                document.getElementById('meal-plans').style.display = 'block';
                // Update active tab button
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
        this.mealPlans = [
            {
                id: 'vegetarian-balanced',
                name: 'Balanced Vegetarian',
                description: 'A nutritionally balanced vegetarian meal plan with Indian cuisine',
                calories: 1950,
                protein: 75,
                carbs: 240,
                fat: 65,
                tags: ['vegetarian', 'balanced', 'moderate-protein'],
                meals: {
                    'breakfast': [
                        { label: 'Masala Dosa', quantity: 1, measure: 'serving', calories: 250, protein: 5, carbs: 45, fats: 5 },
                        { label: 'Coconut Chutney', quantity: 2, measure: 'tbsp', calories: 80, protein: 2, carbs: 4, fats: 7 },
                        { label: 'Sambar', quantity: 1, measure: 'cup', calories: 150, protein: 6, carbs: 20, fats: 5 }
                    ],
                    'morning-snack': [
                        { label: 'Mixed Nuts', quantity: 30, measure: 'g', calories: 180, protein: 6, carbs: 5, fats: 16 },
                        { label: 'Apple', quantity: 1, measure: 'medium', calories: 95, protein: 0.5, carbs: 25, fats: 0.3 }
                    ],
                    'lunch': [
                        { label: 'Brown Rice', quantity: 1, measure: 'cup', calories: 220, protein: 5, carbs: 45, fats: 2 },
                        { label: 'Dal Tadka', quantity: 1, measure: 'cup', calories: 220, protein: 12, carbs: 30, fats: 6 },
                        { label: 'Palak Paneer', quantity: 1, measure: 'cup', calories: 240, protein: 11, carbs: 10, fats: 16 }
                    ],
                    'afternoon-snack': [
                        { label: 'Dhokla', quantity: 2, measure: 'pieces', calories: 120, protein: 5, carbs: 18, fats: 3 },
                        { label: 'Green Chutney', quantity: 1, measure: 'tbsp', calories: 15, protein: 0.5, carbs: 2, fats: 0.5 }
                    ],
                    'dinner': [
                        { label: 'Chapati', quantity: 2, measure: 'pieces', calories: 170, protein: 6, carbs: 30, fats: 2 },
                        { label: 'Mixed Vegetable Curry', quantity: 1, measure: 'cup', calories: 150, protein: 6, carbs: 15, fats: 8 },
                        { label: 'Raita', quantity: 0.5, measure: 'cup', calories: 60, protein: 3, carbs: 6, fats: 2.5 }
                    ],
                    'evening-snack': [
                        { label: 'Masala Chai', quantity: 1, measure: 'cup', calories: 50, protein: 2, carbs: 10, fats: 1.5 },
                        { label: 'Marie Biscuits', quantity: 3, measure: 'pieces', calories: 120, protein: 2, carbs: 20, fats: 3 }
                    ]
                }
            },
            {
                id: 'high-protein-non-veg',
                name: 'High Protein Non-Vegetarian',
                description: 'Protein-rich meal plan with non-vegetarian Indian dishes',
                calories: 2200,
                protein: 140,
                carbs: 200,
                fat: 80,
                tags: ['non-vegetarian', 'high-protein', 'fitness'],
                meals: {
                    'breakfast': [
                        { label: 'Egg Bhurji', quantity: 3, measure: 'eggs', calories: 240, protein: 18, carbs: 3, fats: 18 },
                        { label: 'Whole Wheat Paratha', quantity: 2, measure: 'pieces', calories: 200, protein: 6, carbs: 30, fats: 7 },
                        { label: 'Low-fat Curd', quantity: 1, measure: 'cup', calories: 100, protein: 10, carbs: 12, fats: 2 }
                    ],
                    'morning-snack': [
                        { label: 'Protein Shake', quantity: 1, measure: 'serving', calories: 150, protein: 25, carbs: 5, fats: 2 },
                        { label: 'Banana', quantity: 1, measure: 'medium', calories: 105, protein: 1.3, carbs: 27, fats: 0.4 }
                    ],
                    'lunch': [
                        { label: 'Tandoori Chicken', quantity: 150, measure: 'g', calories: 250, protein: 30, carbs: 2, fats: 14 },
                        { label: 'Jeera Rice', quantity: 1, measure: 'cup', calories: 200, protein: 4, carbs: 40, fats: 3 },
                        { label: 'Cucumber Raita', quantity: 1, measure: 'cup', calories: 80, protein: 5, carbs: 8, fats: 2.5 }
                    ],
                    'afternoon-snack': [
                        { label: 'Roasted Chana', quantity: 50, measure: 'g', calories: 180, protein: 10, carbs: 20, fats: 5 },
                        { label: 'Green Tea', quantity: 1, measure: 'cup', calories: 2, protein: 0, carbs: 0, fats: 0 }
                    ],
                    'dinner': [
                        { label: 'Fish Curry', quantity: 150, measure: 'g', calories: 220, protein: 25, carbs: 8, fats: 10 },
                        { label: 'Brown Rice', quantity: 0.75, measure: 'cup', calories: 165, protein: 3.5, carbs: 35, fats: 1.5 },
                        { label: 'Stir-fried Vegetables', quantity: 1, measure: 'cup', calories: 100, protein: 3, carbs: 12, fats: 5 }
                    ],
                    'evening-snack': [
                        { label: 'Greek Yogurt', quantity: 1, measure: 'cup', calories: 130, protein: 15, carbs: 8, fats: 4 },
                        { label: 'Mixed Berries', quantity: 0.5, measure: 'cup', calories: 40, protein: 0.5, carbs: 10, fats: 0.5 }
                    ]
                }
            },
            {
                id: 'low-carb-keto',
                name: 'Low-Carb Keto Indian',
                description: 'Keto-friendly Indian meal plan with low carbs and high fat',
                calories: 1800,
                protein: 90,
                carbs: 50,
                fat: 140,
                tags: ['keto', 'low-carb', 'high-fat'],
                meals: {
                    'breakfast': [
                        { label: 'Keto Paneer Bhurji', quantity: 1, measure: 'serving', calories: 300, protein: 15, carbs: 5, fats: 25 },
                        { label: 'Bulletproof Coffee', quantity: 1, measure: 'cup', calories: 230, protein: 0, carbs: 0, fats: 25 }
                    ],
                    'morning-snack': [
                        { label: 'Avocado', quantity: 0.5, measure: 'medium', calories: 160, protein: 2, carbs: 8, fats: 15 },
                        { label: 'Almonds', quantity: 15, measure: 'pieces', calories: 100, protein: 4, carbs: 3, fats: 9 }
                    ],
                    'lunch': [
                        { label: 'Tandoori Chicken', quantity: 200, measure: 'g', calories: 320, protein: 40, carbs: 2, fats: 18 },
                        { label: 'Palak Paneer (No Cream)', quantity: 1, measure: 'cup', calories: 200, protein: 10, carbs: 8, fats: 15 },
                        { label: 'Cauliflower Rice', quantity: 1, measure: 'cup', calories: 40, protein: 2, carbs: 8, fats: 0 }
                    ],
                    'afternoon-snack': [
                        { label: 'Cheese Cubes', quantity: 30, measure: 'g', calories: 120, protein: 7, carbs: 1, fats: 10 },
                        { label: 'Cucumber Slices', quantity: 1, measure: 'cup', calories: 16, protein: 0.7, carbs: 3, fats: 0.1 }
                    ],
                    'dinner': [
                        { label: 'Mutton Curry (Keto)', quantity: 150, measure: 'g', calories: 300, protein: 25, carbs: 5, fats: 20 },
                        { label: 'Cabbage Thoran', quantity: 1, measure: 'cup', calories: 90, protein: 3, carbs: 10, fats: 5 }
                    ],
                    'evening-snack': [
                        { label: 'Keto Coconut Ladoo', quantity: 2, measure: 'pieces', calories: 120, protein: 2, carbs: 4, fats: 12 }
                    ]
                }
            },
            {
                id: 'vegan-indian',
                name: 'Vegan Indian',
                description: 'Plant-based Indian meal plan with no animal products',
                calories: 1850,
                protein: 65,
                carbs: 260,
                fat: 60,
                tags: ['vegan', 'plant-based', 'dairy-free'],
                meals: {
                    'breakfast': [
                        { label: 'Poha', quantity: 1, measure: 'cup', calories: 270, protein: 6, carbs: 45, fats: 8 },
                        { label: 'Peanuts', quantity: 1, measure: 'tbsp', calories: 50, protein: 2, carbs: 1.5, fats: 4 },
                        { label: 'Fresh Orange Juice', quantity: 1, measure: 'glass', calories: 110, protein: 2, carbs: 26, fats: 0.5 }
                    ],
                    'morning-snack': [
                        { label: 'Mixed Fruit Bowl', quantity: 1, measure: 'cup', calories: 100, protein: 1.5, carbs: 25, fats: 0.5 }
                    ],
                    'lunch': [
                        { label: 'Rajma Curry', quantity: 1, measure: 'cup', calories: 220, protein: 15, carbs: 30, fats: 5 },
                        { label: 'Brown Rice', quantity: 1, measure: 'cup', calories: 220, protein: 5, carbs: 45, fats: 2 },
                        { label: 'Cucumber Salad', quantity: 1, measure: 'cup', calories: 45, protein: 2, carbs: 10, fats: 0 }
                    ],
                    'afternoon-snack': [
                        { label: 'Roasted Chana', quantity: 30, measure: 'g', calories: 110, protein: 6, carbs: 12, fats: 3 },
                        { label: 'Green Tea', quantity: 1, measure: 'cup', calories: 2, protein: 0, carbs: 0, fats: 0 }
                    ],
                    'dinner': [
                        { label: 'Roti', quantity: 2, measure: 'pieces', calories: 170, protein: 6, carbs: 30, fats: 2 },
                        { label: 'Aloo Gobi', quantity: 1, measure: 'cup', calories: 150, protein: 4, carbs: 20, fats: 7 },
                        { label: 'Tofu Bhurji', quantity: 0.5, measure: 'cup', calories: 120, protein: 14, carbs: 3, fats: 7 }
                    ],
                    'evening-snack': [
                        { label: 'Coconut Water', quantity: 1, measure: 'glass', calories: 45, protein: 2, carbs: 9, fats: 0.5 },
                        { label: 'Dates', quantity: 3, measure: 'pieces', calories: 60, protein: 0.5, carbs: 16, fats: 0 }
                    ]
                }
            },
            {
                id: 'diabetic-friendly',
                name: 'Diabetic-Friendly Indian',
                description: 'Low glycemic index Indian meal plan suitable for diabetics',
                calories: 1700,
                protein: 85,
                carbs: 180,
                fat: 65,
                tags: ['diabetic-friendly', 'low-gi', 'balanced'],
                meals: {
                    'breakfast': [
                        { label: 'Moong Dal Cheela', quantity: 2, measure: 'pieces', calories: 180, protein: 10, carbs: 20, fats: 7 },
                        { label: 'Mint Chutney', quantity: 2, measure: 'tbsp', calories: 20, protein: 1, carbs: 3, fats: 0.5 },
                        { label: 'Low-fat Curd', quantity: 0.5, measure: 'cup', calories: 50, protein: 5, carbs: 6, fats: 1 }
                    ],
                    'morning-snack': [
                        { label: 'Apple', quantity: 1, measure: 'small', calories: 80, protein: 0.4, carbs: 20, fats: 0.3 },
                        { label: 'Walnuts', quantity: 6, measure: 'halves', calories: 90, protein: 2, carbs: 2, fats: 9 }
                    ],
                    'lunch': [
                        { label: 'Multigrain Roti', quantity: 2, measure: 'pieces', calories: 170, protein: 6, carbs: 30, fats: 2 },
                        { label: 'Lauki Sabzi', quantity: 1, measure: 'cup', calories: 80, protein: 2, carbs: 10, fats: 4 },
                        { label: 'Masoor Dal', quantity: 0.5, measure: 'cup', calories: 115, protein: 9, carbs: 20, fats: 0.5 },
                        { label: 'Cucumber Raita', quantity: 0.5, measure: 'cup', calories: 40, protein: 2.5, carbs: 4, fats: 1.5 }
                    ],
                    'afternoon-snack': [
                        { label: 'Roasted Makhana', quantity: 30, measure: 'g', calories: 100, protein: 3.5, carbs: 15, fats: 0.1 },
                        { label: 'Green Tea', quantity: 1, measure: 'cup', calories: 2, protein: 0, carbs: 0, fats: 0 }
                    ],
                    'dinner': [
                        { label: 'Grilled Fish', quantity: 120, measure: 'g', calories: 180, protein: 25, carbs: 0, fats: 8 },
                        { label: 'Brown Rice', quantity: 0.5, measure: 'cup', calories: 110, protein: 2.5, carbs: 22, fats: 1 },
                        { label: 'Mixed Vegetable Curry', quantity: 1, measure: 'cup', calories: 150, protein: 6, carbs: 15, fats: 8 }
                    ],
                    'evening-snack': [
                        { label: 'Buttermilk', quantity: 1, measure: 'glass', calories: 70, protein: 8, carbs: 10, fats: 2 },
                        { label: 'Roasted Chana', quantity: 20, measure: 'g', calories: 70, protein: 4, carbs: 8, fats: 2 }
                    ]
                }
            }
        ];
        
        await this.init();
    }
    
    /**
     * Initialize the meal plans gallery
     */
    async init() {
        // Wait for DOM to be ready
        await new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });

        // Create gallery container
        await this.createGalleryContainer();
        
        // Add event listeners
        await this.addEventListeners();
    }
    
    /**
     * Create the gallery container and add it to the DOM
     */
    async createGalleryContainer() {
        // Create gallery tab button first
        await new Promise(resolve => {
            const checkNavTabs = () => {
                const navTabs = document.querySelector('.nav-tabs');
                if (navTabs) {
                    const galleryTabBtn = document.createElement('button');
                    galleryTabBtn.className = 'tab-btn';
                    galleryTabBtn.setAttribute('data-tab', 'meal-plans');
                    galleryTabBtn.innerHTML = '<i class="fas fa-th-large"></i> Sample Meals';
                    navTabs.appendChild(galleryTabBtn);
                    resolve();
                } else {
                    requestAnimationFrame(checkNavTabs);
                }
            };
            checkNavTabs();
        });

        // Then create gallery tab content
        await new Promise(resolve => {
            const checkContainer = () => {
                const container = document.querySelector('.container');
                if (container) {
                    const galleryTab = document.createElement('div');
                    galleryTab.className = 'tab-content';
                    galleryTab.id = 'meal-plans';
                    
                    // Add header
                    galleryTab.innerHTML = `
                        <div class="gallery-header">
                            <h2>Sample Meal Plans</h2>
                            <p>Browse and load these pre-made meal plans for quick demos</p>
                        </div>
                        <div class="meal-plans-grid"></div>
                    `;
                    
                    container.appendChild(galleryTab);
                    resolve();
                } else {
                    requestAnimationFrame(checkContainer);
                }
            };
            checkContainer();
        });
        
        // Create gallery tab content
        await new Promise(resolve => {
            const checkContainer = () => {
                const container = document.querySelector('.container');
                if (container) {
                    const galleryTab = document.createElement('div');
                    galleryTab.className = 'tab-content';
                    galleryTab.id = 'meal-plans';
                    
                    // Add header
                    galleryTab.innerHTML = `
                        <div class="gallery-header">
                            <h2>Sample Meal Plans</h2>
                            <p>Browse and load these pre-made meal plans for quick demos</p>
                        </div>
                        <div class="meal-plans-grid"></div>
                    `;
                    
                    container.appendChild(galleryTab);
                    resolve();
                } else {
                    requestAnimationFrame(checkContainer);
                }
            };
            checkContainer();
        });
        
        // Populate meal plans
        await this.populateMealPlans();
        }
        
        // Add styles
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .meal-plans-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .meal-plan-card {
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .meal-plan-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }
            
            .meal-plan-header {
                padding: 20px;
                background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%);
                color: white;
            }
            
            .meal-plan-header.vegetarian {
                background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
            }
            
            .meal-plan-header.non-vegetarian {
                background: linear-gradient(135deg, #F44336 0%, #FF9800 100%);
            }
            
            .meal-plan-header.keto {
                background: linear-gradient(135deg, #9C27B0 0%, #673AB7 100%);
            }
            
            .meal-plan-header.vegan {
                background: linear-gradient(135deg, #009688 0%, #4CAF50 100%);
            }
            
            .meal-plan-header.diabetic {
                background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
            }
            
            .meal-plan-header h3 {
                margin: 0 0 10px 0;
                font-size: 1.4rem;
            }
            
            .meal-plan-header p {
                margin: 0;
                opacity: 0.9;
                font-size: 0.9rem;
            }
            
            .meal-plan-content {
                padding: 20px;
            }
            
            .meal-plan-nutrition {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .nutrition-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
            }
            
            .nutrition-value {
                font-size: 1.2rem;
                font-weight: 600;
                color: #4a5568;
            }
            
            .nutrition-label {
                font-size: 0.8rem;
                color: #718096;
            }
            
            .meal-plan-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-bottom: 15px;
            }
            
            .meal-tag {
                background-color: #e2e8f0;
                color: #4a5568;
                font-size: 0.8rem;
                padding: 3px 8px;
                border-radius: 15px;
            }
            
            .meal-plan-actions {
                display: flex;
                justify-content: center;
                margin-top: 15px;
            }
            
            .load-plan-btn {
                background-color: #4a5568;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            
            .load-plan-btn:hover {
                background-color: #2d3748;
            }
            
            .gallery-header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .gallery-header h2 {
                color: #4a5568;
                margin-bottom: 10px;
            }
            
            .gallery-header p {
                color: #718096;
                margin: 0;
            }
            
            /* Modal styles */
            .meal-plan-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                overflow-y: auto;
            }
            
            .meal-plan-modal-content {
                background-color: white;
                margin: 50px auto;
                padding: 30px;
                border-radius: 10px;
                max-width: 800px;
                position: relative;
            }
            
            .close-modal {
                position: absolute;
                top: 15px;
                right: 15px;
                font-size: 1.5rem;
                cursor: pointer;
                color: #718096;
            }
            
            .meal-details-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .meal-detail-section {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
            }
            
            .meal-detail-section h4 {
                margin-top: 0;
                margin-bottom: 10px;
                color: #4a5568;
                font-size: 1.1rem;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 5px;
            }
            
            .meal-item {
                margin-bottom: 8px;
                font-size: 0.9rem;
            }
            
            .meal-item-name {
                font-weight: 500;
            }
            
            .meal-item-details {
                color: #718096;
                font-size: 0.8rem;
            }
            
            .modal-actions {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 30px;
            }
            
            .modal-btn {
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
                border: none;
            }
            
            .load-btn {
                background-color: #4CAF50;
                color: white;
            }
            
            .load-btn:hover {
                background-color: #388E3C;
            }
            
            .cancel-btn {
                background-color: #e2e8f0;
                color: #4a5568;
            }
            
            .cancel-btn:hover {
                background-color: #cbd5e0;
            }
            
            @media (max-width: 768px) {
                .meal-plans-grid {
                    grid-template-columns: 1fr;
                }
                
                .meal-plan-modal-content {
                    margin: 20px;
                    padding: 20px;
                }
                
                .meal-details-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    /**
     * Populate the meal plans grid with cards
     */
    async populateMealPlans() {
        await new Promise(resolve => {
            const checkGrid = () => {
                const mealPlansGrid = document.querySelector('.meal-plans-grid');
                if (mealPlansGrid) {
                    mealPlansGrid.innerHTML = '';
                    this.mealPlans.forEach(plan => {
            // Determine header class based on tags
            let headerClass = '';
            if (plan.tags.includes('vegetarian')) headerClass = 'vegetarian';
            if (plan.tags.includes('non-vegetarian')) headerClass = 'non-vegetarian';
            if (plan.tags.includes('keto')) headerClass = 'keto';
            if (plan.tags.includes('vegan')) headerClass = 'vegan';
            if (plan.tags.includes('diabetic-friendly')) headerClass = 'diabetic';
            
            const planCard = document.createElement('div');
            planCard.className = 'meal-plan-card';
            planCard.setAttribute('data-plan-id', plan.id);
            
            planCard.innerHTML = `
                <div class="meal-plan-header ${headerClass}">
                    <h3>${plan.name}</h3>
                    <p>${plan.description}</p>
                </div>
                <div class="meal-plan-content">
                    <div class="meal-plan-nutrition">
                        <div class="nutrition-item">
                            <span class="nutrition-value">${plan.calories}</span>
                            <span class="nutrition-label">Calories</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-value">${plan.protein}g</span>
                            <span class="nutrition-label">Protein</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-value">${plan.carbs}g</span>
                            <span class="nutrition-label">Carbs</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-value">${plan.fat}g</span>
                            <span class="nutrition-label">Fat</span>
                        </div>
                    </div>
                    <div class="meal-plan-tags">
                        ${plan.tags.map(tag => `<span class="meal-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="meal-plan-actions">
                        <button class="load-plan-btn" data-action="view" data-plan-id="${plan.id}">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            `;
            
            mealPlansGrid.appendChild(planCard);
            resolve();
        });
        
        // Create modal for meal plan details
        this.createMealPlanModal();
    }
    
    /**
     * Create modal for displaying meal plan details
     */
    createMealPlanModal() {
        const modal = document.createElement('div');
        modal.className = 'meal-plan-modal';
        modal.id = 'meal-plan-modal';
        
        modal.innerHTML = `
            <div class="meal-plan-modal-content">
                <span class="close-modal">&times;</span>
                <div id="meal-plan-modal-body"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    /**
     * Add event listeners for gallery interactions
     */
    async addEventListeners() {
        await new Promise(resolve => {
            const checkElements = () => {
                if (document.querySelector('.load-plan-btn')) {
                    resolve();
                } else {
                    requestAnimationFrame(checkElements);
                }
            };
            checkElements();
        });

        // View meal plan details
        document.addEventListener('click', (e) => {
            if (e.target.closest('.load-plan-btn[data-action="view"]')) {
                const button = e.target.closest('.load-plan-btn');
                const planId = button.getAttribute('data-plan-id');
                this.showMealPlanDetails(planId);
            }
        });
        
        // Close modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('.close-modal') || e.target.matches('.cancel-btn')) {
                this.closeMealPlanModal();
            }
        });
        
        // Load meal plan
        document.addEventListener('click', (e) => {
            if (e.target.matches('.load-btn')) {
                const planId = e.target.getAttribute('data-plan-id');
                this.loadMealPlan(planId);
            }
        });
    }
    
    /**
     * Show meal plan details in modal
     * @param {string} planId - ID of the meal plan to display
     */
    showMealPlanDetails(planId) {
        const plan = this.mealPlans.find(p => p.id === planId);
        if (!plan) return;
        
        const modalBody = document.getElementById('meal-plan-modal-body');
        if (!modalBody) return;
        
        // Determine header class based on tags
        let headerClass = '';
        if (plan.tags.includes('vegetarian')) headerClass = 'vegetarian';
        if (plan.tags.includes('non-vegetarian')) headerClass = 'non-vegetarian';
        if (plan.tags.includes('keto')) headerClass = 'keto';
        if (plan.tags.includes('vegan')) headerClass = 'vegan';
        if (plan.tags.includes('diabetic-friendly')) headerClass = 'diabetic';
        
        modalBody.innerHTML = `
            <div class="meal-plan-header ${headerClass}">
                <h3>${plan.name}</h3>
                <p>${plan.description}</p>
            </div>
            
            <div class="meal-plan-nutrition" style="margin-top: 20px;">
                <div class="nutrition-item">
                    <span class="nutrition-value">${plan.calories}</span>
                    <span class="nutrition-label">Calories</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-value">${plan.protein}g</span>
                    <span class="nutrition-label">Protein</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-value">${plan.carbs}g</span>
                    <span class="nutrition-label">Carbs</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-value">${plan.fat}g</span>
                    <span class="nutrition-label">Fat</span>
                </div>
            </div>
            
            <div class="meal-plan-tags" style="margin-top: 15px;">
                ${plan.tags.map(tag => `<span class="meal-tag">${tag}</span>`).join('')}
            </div>
            
            <div class="meal-details-grid">
        `;
        
        // Add each meal section
        const mealTypes = {
            'breakfast': 'Breakfast',
            'morning-snack': 'Morning Snack',
            'lunch': 'Lunch',
            'afternoon-snack': 'Afternoon Snack',
            'dinner': 'Dinner',
            'evening-snack': 'Evening Snack'
        };
        
        Object.entries(mealTypes).forEach(([key, label]) => {
            const mealItems = plan.meals[key] || [];
            if (mealItems.length === 0) return;
            
            const mealSection = document.createElement('div');
            mealSection.className = 'meal-detail-section';
            mealSection.innerHTML = `<h4>${label}</h4>`;
            
            mealItems.forEach(item => {
                const mealItem = document.createElement('div');
                mealItem.className = 'meal-item';
                mealItem.innerHTML = `
                    <div class="meal-item-name">${item.label}</div>
                    <div class="meal-item-details">
                        ${item.quantity} ${item.measure} - ${item.calories} cal, 
                        P: ${item.protein}g, C: ${item.carbs}g, F: ${item.fats}g
                    </div>
                `;
                mealSection.appendChild(mealItem);
            });
            
            modalBody.querySelector('.meal-details-grid').appendChild(mealSection);
        });
        
        // Add action buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'modal-actions';
        actionsDiv.innerHTML = `
            <button class="modal-btn load-btn" data-plan-id="${plan.id}">
                <i class="fas fa-download"></i> Load This Meal Plan
            </button>
            <button class="modal-btn cancel-btn">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;
        
        modalBody.appendChild(actionsDiv);
        
        // Show modal
        document.getElementById('meal-plan-modal').style.display = 'block';
    }
    
    /**
     * Close the meal plan modal
     */
    closeMealPlanModal() {
        const modal = document.getElementById('meal-plan-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    /**
     * Load the selected meal plan into the calculator
     * @param {string} planId - ID of the meal plan to load
     */
    loadMealPlan(planId) {
        const plan = this.mealPlans.find(p => p.id === planId);
        if (!plan || !window.mealCalculator) return;
        
        // Clear existing meals
        Object.keys(window.mealCalculator.meals).forEach(mealType => {
            window.mealCalculator.meals[mealType] = [];
        });
        
        // Load new meal plan
        Object.entries(plan.meals).forEach(([mealType, items]) => {
            items.forEach(item => {
                // Convert to the format expected by the meal calculator
                const foodItem = {
                    label: item.label,
                    quantity: item.quantity,
                    measure: item.measure,
                    nutrition: {
                        calories: item.calories,
                        protein: item.protein,
                        carbs: item.carbs,
                        fats: item.fats
                    }
                };
                
                window.mealCalculator.meals[mealType].push(foodItem);
            });
        });
        
        // Update nutrition display
        window.mealCalculator.updateNutritionDisplay();
        
        // Update meal displays
        Object.keys(window.mealCalculator.meals).forEach(mealType => {
            window.mealCalculator.renderMealItems(mealType);
        });
        
        // Close modal
        this.closeMealPlanModal();
        
        // Show success message
        alert(`${plan.name} meal plan loaded successfully!`);
        
        // Switch to planner tab
        const plannerTabBtn = document.querySelector('.tab-btn[data-tab="planner"]');
        if (plannerTabBtn) {
            plannerTabBtn.click();
        }
    }
}

// Initialize meal plans gallery when document is ready
document.addEventListener('DOMContentLoaded', function() {
    const mealPlansGallery = new MealPlansGallery();
    
    // Make gallery available globally
    window.mealPlansGallery = mealPlansGallery;
});