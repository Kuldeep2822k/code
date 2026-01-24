/**
 * charts.js - Data visualization for the Indian Meal Calculator
 * This script adds interactive charts for better nutrition tracking visualization
 */

(() => {
    // Skip if already initialized
    if (window.nutritionCharts) return;

    class NutritionCharts {
        constructor() {
            this.chartColors = {
                calories: {
                    primary: '#FF6384',
                    background: 'rgba(255, 99, 132, 0.2)'
                },
                protein: {
                    primary: '#36A2EB',
                    background: 'rgba(54, 162, 235, 0.2)'
                },
                carbs: {
                    primary: '#FFCE56',
                    background: 'rgba(255, 206, 86, 0.2)'
                },
                fat: {
                    primary: '#4BC0C0',
                    background: 'rgba(75, 192, 192, 0.2)'
                },
                meals: [
                    '#FF6384', // Breakfast
                    '#36A2EB', // Morning Snack
                    '#FFCE56', // Lunch
                    '#4BC0C0', // Afternoon Snack
                    '#9966FF', // Dinner
                    '#FF9F40'  // Evening Snack
                ]
            };

            this.charts = {};
            this.mealNames = [
                'Breakfast',
                'Morning Snack',
                'Lunch',
                'Afternoon Snack',
                'Dinner',
                'Evening Snack'
            ];
        }
        
        /**
         * Initialize charts
         */
        static async initialize() {
            if (window.nutritionCharts) return;

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
            }

            // Create and initialize instance
            const instance = new NutritionCharts();
            await instance.init();
            window.nutritionCharts = instance
        }

        async init() {
            // Wait for document.body to be available
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
    
            // Add Chart.js library if not already included
            await this.loadChartJsLibrary();
            
            // Create chart containers
            await this.createChartContainers();
            
            // Initialize charts
            await this.initializeCharts();
            
            // Update charts with current data
            await this.updateChartsWithCurrentData();

            // Add event listener for tab switching
            document.querySelectorAll('.tab-btn').forEach(button => {
                button.addEventListener('click', () => {
                    // Resize charts when nutrition tab is shown
                    if (button.getAttribute('data-tab') === 'nutrition') {
                        setTimeout(() => {
                            this.resizeCharts();
                        }, 400);
                    }
                });
            });
        }

        /**
         * Load Chart.js library dynamically
         * @returns {Promise} - Resolves when library is loaded
         */
        loadChartJsLibrary() {
            return new Promise((resolve, reject) => {
                // Check if Chart.js is already loaded
                if (window.Chart) {
                    resolve();
                    return;
                }

                // Create script element
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js';
                script.integrity = 'sha256-ErZ09KkZnzjpqcane4SCyyHsKAXMvID9/xwbl/Aq1pc=';
                script.crossOrigin = 'anonymous';

                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Chart.js'));

                document.head.appendChild(script);
            });
        }
        
        /**
         * Create chart containers in the DOM
         */
        async createChartContainers() {
            // Create container for macro distribution chart
            const macroChartContainer = document.createElement('div');
            macroChartContainer.className = 'chart-container';
            macroChartContainer.innerHTML = `
                <h3>Macronutrient Distribution</h3>
                <div class="chart-wrapper">
                    <canvas id="macro-distribution-chart"></canvas>
                </div>
            `;
            
            // Create container for meal breakdown chart
            const mealChartContainer = document.createElement('div');
            mealChartContainer.className = 'chart-container';
            mealChartContainer.innerHTML = `
                <h3>Calories by Meal</h3>
                <div class="chart-wrapper">
                    <canvas id="meal-breakdown-chart"></canvas>
                </div>
            `;
            
            // Create container for weekly trend chart
            const weeklyChartContainer = document.createElement('div');
            weeklyChartContainer.className = 'chart-container';
            weeklyChartContainer.innerHTML = `
                <h3>Weekly Nutrition Trends</h3>
                <div class="chart-wrapper">
                    <canvas id="weekly-trend-chart"></canvas>
                </div>
                <div class="chart-legend">
                    <div class="legend-item"><span class="legend-color" style="background-color: #FF6384;"></span> Calories (÷10)</div>
                    <div class="legend-item"><span class="legend-color" style="background-color: #36A2EB;"></span> Protein (g)</div>
                    <div class="legend-item"><span class="legend-color" style="background-color: #FFCE56;"></span> Carbs (g)</div>
                    <div class="legend-item"><span class="legend-color" style="background-color: #4BC0C0;"></span> Fat (g)</div>
                </div>
            `;
            
            // Create charts section
            const chartsSection = document.createElement('div');
            chartsSection.className = 'charts-section';
            chartsSection.appendChild(macroChartContainer);
            chartsSection.appendChild(mealChartContainer);
            chartsSection.appendChild(weeklyChartContainer);
            
            // Add charts section to nutrition summary tab
            await new Promise(resolve => {
                const checkNutritionTab = () => {
                    const nutritionSummaryTab = document.getElementById('nutrition');
                    if (nutritionSummaryTab) {
                        // Add after nutrition cards
                        const nutritionCards = nutritionSummaryTab.querySelector('.nutrition-cards');
                        if (nutritionCards) {
                            nutritionCards.parentNode.insertBefore(chartsSection, nutritionCards.nextSibling);
                        } else {
                            nutritionSummaryTab.appendChild(chartsSection);
                        }
                        resolve();
                    } else {
                        requestAnimationFrame(checkNutritionTab);
                    }
                };
                checkNutritionTab();
            });
            
            // Add styles
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .charts-section {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }

                .chart-container {
                    background-color: white;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                }

                .chart-container:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }

                .chart-container h3 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #4a5568;
                    font-size: 1.2rem;
                    text-align: center;
                }

                .chart-wrapper {
                    position: relative;
                    height: 250px;
                }

                .chart-legend {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    margin-top: 15px;
                    gap: 10px;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    font-size: 0.9rem;
                    color: #718096;
                }

                .legend-color {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    margin-right: 5px;
                }

                @media (max-width: 768px) {
                    .charts-section {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(styleElement);
        }
        
        /**
         * Initialize chart instances
         */
        async initializeCharts() {
            try {
                // Create chart containers if they don't exist
                const nutritionTab = document.getElementById('nutrition');
                if (!nutritionTab) {
                    console.error('Nutrition tab not found');
                    return;
                }

                // Determine if we need to restore visibility later
                // If the nutrition tab is NOT active, we'll want to hide it after we're done
                const wasOriginallyHidden = !nutritionTab.classList.contains('active');

                // Show nutrition tab temporarily to allow charts to render correctly
                // Chart.js requires canvas to be visible for dimension calculations
                const originalDisplay = nutritionTab.style.display;
                nutritionTab.style.display = 'block';

                // Create chart containers
                const containers = [
                    {
                        id: 'macro-distribution-chart',
                        title: 'Macro Distribution'
                    },
                    {
                        id: 'meal-breakdown-chart',
                        title: 'Meal Breakdown'
                    },
                    {
                        id: 'weekly-trend-chart',
                        title: 'Weekly Trend'
                    }
                ];

                // Create containers and wait for them to be rendered
                await Promise.all(containers.map(async container => {
                    if (!document.getElementById(container.id)) {
                        const chartContainer = document.createElement('div');
                        chartContainer.className = 'chart-container';
                        chartContainer.innerHTML = `
                            <h3>${container.title}</h3>
                            <canvas id="${container.id}"></canvas>
                        `;
                        nutritionTab.appendChild(chartContainer);

                        // Wait for the container to be rendered
                        await new Promise(resolve => requestAnimationFrame(resolve));
                    }
                }));

                // Additional wait to ensure DOM is updated and styles are applied
                await new Promise(resolve => setTimeout(resolve, 100));

                // Force a reflow to ensure containers are properly sized
                // This toggle is needed for some browsers to register the size
                nutritionTab.style.display = 'none';
                nutritionTab.offsetHeight; // Force reflow
                nutritionTab.style.display = 'block';

                // Initialize macro distribution chart
                const macroCtx = document.getElementById('macro-distribution-chart');
                this.charts.macroDistribution = new Chart(macroCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Protein', 'Carbs', 'Fat'],
                        datasets: [{
                            data: [0, 0, 0],
                            backgroundColor: [
                                this.chartColors.protein.primary,
                                this.chartColors.carbs.primary,
                                this.chartColors.fat.primary
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.raw || 0;
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                        return `${label}: ${value}g (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            
                // Meal breakdown chart (bar)
                const mealCtx = document.getElementById('meal-breakdown-chart');
                if (mealCtx) {
                    this.charts.mealBreakdown = new Chart(mealCtx, {
                        type: 'bar',
                        data: {
                            labels: this.mealNames,
                            datasets: [{
                                label: 'Calories',
                                data: [0, 0, 0, 0, 0, 0],
                                backgroundColor: this.chartColors.meals,
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Calories'
                                    }
                                }
                            }
                        }
                    });
                }

                // Weekly trend chart (line)
                const weeklyCtx = document.getElementById('weekly-trend-chart');
                if (weeklyCtx) {
                    // Generate last 7 days for labels
                    const labels = [];
                    for (let i = 6; i >= 0; i--) {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                    }

                    this.charts.weeklyTrend = new Chart(weeklyCtx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Calories (÷10)',
                                    data: new Array(7).fill(0), // Removed random data
                                    borderColor: this.chartColors.calories.primary,
                                    backgroundColor: this.chartColors.calories.background,
                                    tension: 0.4,
                                    fill: false
                                },
                                {
                                    label: 'Protein (g)',
                                    data: new Array(7).fill(0), // Removed random data
                                    borderColor: this.chartColors.protein.primary,
                                    backgroundColor: this.chartColors.protein.background,
                                    tension: 0.4,
                                    fill: false
                                },
                                {
                                    label: 'Carbs (g)',
                                    data: new Array(7).fill(0), // Removed random data
                                    borderColor: this.chartColors.carbs.primary,
                                    backgroundColor: this.chartColors.carbs.background,
                                    tension: 0.4,
                                    fill: false
                                },
                                {
                                    label: 'Fat (g)',
                                    data: new Array(7).fill(0), // Removed random data
                                    borderColor: this.chartColors.fat.primary,
                                    backgroundColor: this.chartColors.fat.background,
                                    tension: 0.4,
                                    fill: false
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                subtitle: {
                                    display: true,
                                    text: 'Historical data not available (Demo)'
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Amount'
                                    }
                                }
                            }
                        }
                    });
                }

                // Restore original visibility state
                if (wasOriginallyHidden) {
                    nutritionTab.style.display = originalDisplay; // Should revert to empty string or none, letting CSS class control it
                    // Double check if it needs to be hidden
                    if (!nutritionTab.classList.contains('active')) {
                        nutritionTab.style.display = 'none';
                    }
                }

            } catch (error) {
                console.warn('Chart initialization failed:', error);
                return;
            }
        }
        
        /**
         * Update charts with current meal data
         */
        updateChartsWithCurrentData() {
            // Get meal calculator instance
            const mealCalculator = window.mealCalculator;
            if (!mealCalculator) return;

            // Get current nutrition data
            const totalProtein = mealCalculator.getTotalNutrient('protein');
            const totalCarbs = mealCalculator.getTotalNutrient('carbs');
            const totalFat = mealCalculator.getTotalNutrient('fat');

            // Update macro distribution chart
            if (this.charts.macroDistribution) {
                this.charts.macroDistribution.data.datasets[0].data = [
                    totalProtein,
                    totalCarbs,
                    totalFat
                ];
                this.charts.macroDistribution.update();
            }
            
            // Update meal breakdown chart
            if (this.charts.mealBreakdown) {
                const mealCalories = [];
                
                // Get calories for each meal
                this.mealNames.forEach((mealName, index) => {
                    // Fix: Use hyphen instead of underscore to match script.js keys
                    const mealType = mealName.toLowerCase().replace(' ', '-');
                    const mealItems = mealCalculator.meals[mealType] || [];

                    // Calculate total calories for this meal
                    const calories = mealItems.reduce((total, item) => {
                        // Handle both standard format (flat properties) and legacy format (nested nutrition)
                        const itemCalories = item.calories || (item.nutrition && item.nutrition.calories) || 0;
                        return total + itemCalories;
                    }, 0);

                    mealCalories.push(calories);
                });
                
                this.charts.mealBreakdown.data.datasets[0].data = mealCalories;
                this.charts.mealBreakdown.update();
            }
            
            // Add event listener to update charts when meals change
            document.addEventListener('mealsUpdated', () => {
                this.updateChartsWithCurrentData();
            });
        }
        
        /**
         * Resize charts to fit container
         */
        resizeCharts() {
            Object.values(this.charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        }
    }

    // Expose class to window
    window.NutritionCharts = NutritionCharts;

    // Initialize NutritionCharts when DOM is ready
    const initializeCharts = async () => {
        if (!window.nutritionCharts) {
            const charts = new NutritionCharts();
            await charts.init();
            window.nutritionCharts = charts;
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initializeCharts());
    } else {
        // If script.js hasn't initialized it yet, we can do it here.
        // But since we now expose the class, script.js might be doing it.
        // We'll leave this as a fallback.
        initializeCharts();
    }
})();
