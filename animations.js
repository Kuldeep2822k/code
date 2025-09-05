/**
 * animations.js - Enhances the Indian Meal Calculator with animations
 * This script applies animations to dynamically created elements and handles
 * animation timing for a more polished user experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Apply initial animations to static elements
    initializeAnimations();
    
    // Set up mutation observer to watch for dynamically added elements
    setupMutationObserver();
    
    // Add animation classes to tab switching
    enhanceTabSwitching();
    
    // Enhance modal animations
    enhanceModalAnimations();
});

/**
 * Initialize animations for static elements on page load
 */
function initializeAnimations() {
    // Apply staggered animations to meal sections
    const mealSections = document.querySelectorAll('.meal-section');
    applyStaggeredAnimation(mealSections, 'meal-section');
    
    // Apply staggered animations to nutrition cards
    const nutritionCards = document.querySelectorAll('.nutrition-card');
    applyStaggeredAnimation(nutritionCards, 'nutrition-card');
    
    // Apply staggered animations to goals form groups
    const formGroups = document.querySelectorAll('.goals-form .form-group');
    applyStaggeredAnimation(formGroups, 'form-group');
    
    // Add hover effects to action buttons
    const actionButtons = document.querySelectorAll('.action-btn, .add-item-btn, .tab-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
    });
}

/**
 * Apply staggered animations to a collection of elements
 * @param {NodeList} elements - The elements to animate
 * @param {string} className - The CSS class name for animation
 */
function applyStaggeredAnimation(elements, className) {
    elements.forEach((el, index) => {
        el.style.setProperty('--index', index + 1);
    });
}

/**
 * Set up mutation observer to watch for dynamically added elements
 */
function setupMutationObserver() {
    // Create an observer instance
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check for food items
                        if (node.classList && node.classList.contains('food-item')) {
                            animateNewFoodItem(node);
                        }
                        
                        // Check for search results
                        if (node.classList && node.classList.contains('food-result-item')) {
                            animateSearchResult(node);
                        }
                        
                        // Check for recognized foods
                        if (node.parentNode && node.parentNode.id === 'recognized-foods') {
                            animateRecognizedFood(node);
                        }
                    }
                });
            }
        });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Animate a newly added food item
 * @param {Element} foodItem - The food item element
 */
function animateNewFoodItem(foodItem) {
    foodItem.style.opacity = '0';
    foodItem.style.transform = 'translateX(50px)';
    
    setTimeout(() => {
        foodItem.style.transition = 'all 0.3s ease-out';
        foodItem.style.opacity = '1';
        foodItem.style.transform = 'translateX(0)';
    }, 10);
}

/**
 * Animate a search result item
 * @param {Element} resultItem - The search result element
 */
function animateSearchResult(resultItem) {
    const results = document.querySelectorAll('.food-result-item');
    const index = Array.from(results).indexOf(resultItem);
    
    resultItem.style.opacity = '0';
    resultItem.style.setProperty('--index', index + 1);
    
    setTimeout(() => {
        resultItem.style.animation = 'fadeIn 0.3s ease-out forwards';
        resultItem.style.animationDelay = `${index * 0.05}s`;
    }, 10);
}

/**
 * Animate a recognized food item
 * @param {Element} foodItem - The recognized food element
 */
function animateRecognizedFood(foodItem) {
    const items = document.querySelectorAll('#recognized-foods .food-result-item');
    const index = Array.from(items).indexOf(foodItem);
    
    foodItem.style.opacity = '0';
    foodItem.style.setProperty('--index', index + 1);
    
    setTimeout(() => {
        foodItem.style.animation = 'slideInBottom 0.3s ease-out forwards';
        foodItem.style.animationDelay = `${index * 0.1}s`;
    }, 10);
}

/**
 * Enhance tab switching with animations
 */
function enhanceTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the target tab
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and add to current
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Animate out current tab content
            tabContents.forEach(content => {
                if (content.classList.contains('active')) {
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                    
                    // Animate out
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        content.classList.remove('active');
                    }, 300);
                }
            });
            
            // Animate in new tab content after a delay
            setTimeout(() => {
                const activeContent = document.getElementById(targetTab);
                activeContent.classList.add('active');
                
                // Set initial state
                activeContent.style.opacity = '0';
                activeContent.style.transform = 'translateY(10px)';
                
                // Trigger animation
                setTimeout(() => {
                    activeContent.style.opacity = '1';
                    activeContent.style.transform = 'translateY(0)';
                }, 50);
            }, 350);
        });
    });
}

/**
 * Enhance modal animations
 */
function enhanceModalAnimations() {
    // Food selector modal
    const foodSelectorModal = document.getElementById('food-selector-modal');
    if (foodSelectorModal) {
        const modalContent = foodSelectorModal.querySelector('.modal-content');
        
        // Show modal with animation
        window.showFoodSelectorModal = function(mealType) {
            foodSelectorModal.style.display = 'flex';
            modalContent.style.transform = 'translateY(20px)';
            modalContent.style.opacity = '0';
            
            setTimeout(() => {
                modalContent.style.transition = 'all 0.4s ease-out';
                modalContent.style.transform = 'translateY(0)';
                modalContent.style.opacity = '1';
            }, 10);
            
            // Set the current meal type
            document.getElementById('current-meal-type').textContent = mealType;
        };
        
        // Close modal with animation
        window.closeFoodSelectorModal = function() {
            modalContent.style.transform = 'translateY(0)';
            modalContent.style.opacity = '1';
            
            modalContent.style.transform = 'translateY(20px)';
            modalContent.style.opacity = '0';
            
            setTimeout(() => {
                foodSelectorModal.style.display = 'none';
            }, 300);
        };
    }
    
    // Apply similar animations to other modals
    enhanceModalAnimation('barcode-scanner-modal');
    enhanceModalAnimation('manual-barcode-modal');
    enhanceModalAnimation('image-capture-modal');
    enhanceModalAnimation('recognized-foods-modal');
}

/**
 * Enhance a specific modal with animations
 * @param {string} modalId - The ID of the modal to enhance
 */
function enhanceModalAnimation(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        
        // Override the show function if it exists
        const showFunctionName = 'show' + modalId.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        
        if (window[showFunctionName]) {
            const originalShowFn = window[showFunctionName];
            window[showFunctionName] = function() {
                // Call original function
                originalShowFn.apply(this, arguments);
                
                // Add animation
                modalContent.style.transform = 'translateY(20px)';
                modalContent.style.opacity = '0';
                
                setTimeout(() => {
                    modalContent.style.transition = 'all 0.4s ease-out';
                    modalContent.style.transform = 'translateY(0)';
                    modalContent.style.opacity = '1';
                }, 10);
            };
        }
        
        // Override the close function if it exists
        const closeFunctionName = 'close' + modalId.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        
        if (window[closeFunctionName]) {
            const originalCloseFn = window[closeFunctionName];
            window[closeFunctionName] = function() {
                // Add animation
                modalContent.style.transform = 'translateY(0)';
                modalContent.style.opacity = '1';
                
                modalContent.style.transform = 'translateY(20px)';
                modalContent.style.opacity = '0';
                
                setTimeout(() => {
                    // Call original function
                    originalCloseFn.apply(this, arguments);
                }, 300);
            };
        }
    }
}

// Add pulse animation to the "Add Food" buttons to draw attention
function addPulseToAddButtons() {
    const addButtons = document.querySelectorAll('.add-item-btn');
    addButtons.forEach(button => {
        // Add pulse animation class
        button.classList.add('pulse-attention');
        
        // Remove the animation after a few seconds
        setTimeout(() => {
            button.classList.remove('pulse-attention');
        }, 5000);
    });
}

// Call this function after a short delay when the page loads
setTimeout(addPulseToAddButtons, 2000);