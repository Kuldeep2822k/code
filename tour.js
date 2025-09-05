/**
 * tour.js - Guided tour for first-time users of the Indian Meal Calculator
 * This script implements a step-by-step walkthrough of the app's key features
 */

class GuidedTour {
    constructor() {
        this.currentStep = 0;
        this.tourSteps = [
            {
                element: '.header',
                title: 'Welcome to Indian Meal Calculator!',
                content: 'This app helps you plan and track your daily nutrition with a focus on Indian foods. Let\'s take a quick tour of the main features.',
                position: 'bottom'
            },
            {
                element: '.nav-tabs',
                title: 'Navigation Tabs',
                content: 'Use these tabs to switch between Meal Planner, Nutrition Summary, and Daily Goals.',
                position: 'bottom'
            },
            {
                element: '.meal-section:first-child',
                title: 'Meal Sections',
                content: 'Your day is divided into six meal periods. Add food items to each meal to track your nutrition.',
                position: 'right'
            },
            {
                element: '.add-item-btn:first-child',
                title: 'Add Food Items',
                content: 'Click here to search and add food items to your meals.',
                position: 'right'
            },
            {
                element: '#nutrition-summary',
                title: 'Nutrition Summary',
                content: 'View your total calories, protein, carbs, and fats for the day.',
                position: 'left'
            },
            {
                element: '#daily-goals',
                title: 'Daily Goals',
                content: 'Set personalized nutrition targets based on your health objectives.',
                position: 'left'
            },
            {
                element: '.action-buttons',
                title: 'Action Buttons',
                content: 'Use these buttons to clear, save, or export your meal plan.',
                position: 'top'
            },
            {
                element: '.competition-link',
                title: 'Competition Features',
                content: 'Check out our competition entry and demo video showcasing all features.',
                position: 'bottom'
            }
        ];
        
        this.tourOverlay = null;
        this.tourPopup = null;
        this.hasSeenTour = localStorage.getItem('hasSeenTour') === 'true';
    }
    
    /**
     * Initialize the tour
     */
    init() {
        // Create tour elements
        this.createTourElements();
        
        // Add event listeners
        document.getElementById('tour-next-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('tour-prev-btn').addEventListener('click', () => this.prevStep());
        document.getElementById('tour-close-btn').addEventListener('click', () => this.endTour());
        document.getElementById('tour-skip-btn').addEventListener('click', () => this.endTour());
        
        // Check if first-time user
        if (!this.hasSeenTour) {
            // Show welcome message with option to start tour
            this.showWelcomeMessage();
        }
        
        // Add tour button to header
        this.addTourButton();
    }
    
    /**
     * Create tour overlay and popup elements
     */
    createTourElements() {
        // Create overlay
        this.tourOverlay = document.createElement('div');
        this.tourOverlay.className = 'tour-overlay';
        document.body.appendChild(this.tourOverlay);
        
        // Create popup
        this.tourPopup = document.createElement('div');
        this.tourPopup.className = 'tour-popup';
        this.tourPopup.innerHTML = `
            <div class="tour-header">
                <h3 id="tour-title">Welcome</h3>
                <button id="tour-close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="tour-content" id="tour-content"></div>
            <div class="tour-footer">
                <button id="tour-skip-btn">Skip Tour</button>
                <div class="tour-navigation">
                    <button id="tour-prev-btn" disabled><i class="fas fa-arrow-left"></i> Previous</button>
                    <span id="tour-progress">1/${this.tourSteps.length}</span>
                    <button id="tour-next-btn">Next <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(this.tourPopup);
        
        // Add styles
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .tour-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9998;
                display: none;
            }
            
            .tour-popup {
                position: fixed;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                width: 350px;
                z-index: 9999;
                display: none;
                overflow: hidden;
                animation: tourFadeIn 0.3s ease-out;
            }
            
            .tour-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .tour-header h3 {
                margin: 0;
                font-size: 1.2rem;
            }
            
            .tour-header button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1.2rem;
            }
            
            .tour-content {
                padding: 20px;
                line-height: 1.6;
                color: #4a5568;
            }
            
            .tour-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background-color: #f8f9fa;
                border-top: 1px solid #e2e8f0;
            }
            
            .tour-navigation {
                display: flex;
                align-items: center;
            }
            
            .tour-navigation button {
                background: none;
                border: none;
                color: #667eea;
                cursor: pointer;
                font-weight: 600;
                padding: 5px 10px;
            }
            
            .tour-navigation button:disabled {
                color: #cbd5e0;
                cursor: not-allowed;
            }
            
            .tour-navigation span {
                margin: 0 10px;
                color: #718096;
                font-size: 0.9rem;
            }
            
            #tour-skip-btn {
                background: none;
                border: none;
                color: #718096;
                cursor: pointer;
                font-size: 0.9rem;
            }
            
            .tour-highlight {
                position: relative;
                z-index: 9999;
                box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.5);
                border-radius: 4px;
            }
            
            .tour-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 1.2rem;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
                z-index: 9997;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .tour-button:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }
            
            .welcome-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                border-radius: 15px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
                width: 90%;
                max-width: 500px;
                z-index: 9999;
                overflow: hidden;
                animation: welcomeFadeIn 0.5s ease-out;
            }
            
            .welcome-header {
                padding: 25px 30px;
                background: linear-gradient(135deg, #ff7e5f, #feb47b);
                color: white;
                text-align: center;
            }
            
            .welcome-header h2 {
                margin: 0 0 10px;
                font-size: 1.8rem;
            }
            
            .welcome-header p {
                margin: 0;
                font-size: 1.1rem;
                opacity: 0.9;
            }
            
            .welcome-content {
                padding: 30px;
                text-align: center;
                color: #4a5568;
                line-height: 1.7;
            }
            
            .welcome-buttons {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 25px;
            }
            
            .welcome-buttons button {
                padding: 12px 25px;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .start-tour-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
            }
            
            .start-tour-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }
            
            .skip-tour-btn {
                background: none;
                border: 1px solid #cbd5e0;
                color: #718096;
            }
            
            .skip-tour-btn:hover {
                background-color: #f8f9fa;
            }
            
            @keyframes tourFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes welcomeFadeIn {
                from { opacity: 0; transform: translate(-50%, -40%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    /**
     * Show welcome message for first-time users
     */
    showWelcomeMessage() {
        const welcomeOverlay = document.createElement('div');
        welcomeOverlay.className = 'tour-overlay';
        welcomeOverlay.style.display = 'block';
        document.body.appendChild(welcomeOverlay);
        
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <div class="welcome-header">
                <h2>Welcome to Indian Meal Calculator!</h2>
                <p>Your personal nutrition assistant</p>
            </div>
            <div class="welcome-content">
                <p>Thank you for choosing our app to plan and track your daily nutrition with a focus on Indian foods.</p>
                <p>Would you like to take a quick tour to learn about the main features?</p>
                <div class="welcome-buttons">
                    <button class="start-tour-btn">Start Tour</button>
                    <button class="skip-tour-btn">Skip for Now</button>
                </div>
            </div>
        `;
        document.body.appendChild(welcomeMessage);
        
        // Add event listeners
        welcomeMessage.querySelector('.start-tour-btn').addEventListener('click', () => {
            document.body.removeChild(welcomeOverlay);
            document.body.removeChild(welcomeMessage);
            this.startTour();
        });
        
        welcomeMessage.querySelector('.skip-tour-btn').addEventListener('click', () => {
            document.body.removeChild(welcomeOverlay);
            document.body.removeChild(welcomeMessage);
            localStorage.setItem('hasSeenTour', 'true');
        });
    }
    
    /**
     * Add tour button to the page
     */
    addTourButton() {
        const tourButton = document.createElement('button');
        tourButton.className = 'tour-button';
        tourButton.innerHTML = '<i class="fas fa-question"></i>';
        tourButton.title = 'Start Tour';
        tourButton.addEventListener('click', () => this.startTour());
        document.body.appendChild(tourButton);
    }
    
    /**
     * Start the guided tour
     */
    startTour() {
        this.currentStep = 0;
        this.tourOverlay.style.display = 'block';
        this.tourPopup.style.display = 'block';
        this.showStep(0);
    }
    
    /**
     * End the guided tour
     */
    endTour() {
        this.tourOverlay.style.display = 'none';
        this.tourPopup.style.display = 'none';
        
        // Remove highlight from current element
        const highlightedElement = document.querySelector('.tour-highlight');
        if (highlightedElement) {
            highlightedElement.classList.remove('tour-highlight');
        }
        
        // Mark as seen
        localStorage.setItem('hasSeenTour', 'true');
    }
    
    /**
     * Show a specific step in the tour
     * @param {number} stepIndex - The index of the step to show
     */
    showStep(stepIndex) {
        // Remove highlight from previous element
        const highlightedElement = document.querySelector('.tour-highlight');
        if (highlightedElement) {
            highlightedElement.classList.remove('tour-highlight');
        }
        
        const step = this.tourSteps[stepIndex];
        const targetElement = document.querySelector(step.element);
        
        if (!targetElement) {
            console.error(`Element not found: ${step.element}`);
            this.nextStep();
            return;
        }
        
        // Highlight target element
        targetElement.classList.add('tour-highlight');
        
        // Update popup content
        document.getElementById('tour-title').textContent = step.title;
        document.getElementById('tour-content').textContent = step.content;
        document.getElementById('tour-progress').textContent = `${stepIndex + 1}/${this.tourSteps.length}`;
        
        // Update button states
        document.getElementById('tour-prev-btn').disabled = stepIndex === 0;
        const nextBtn = document.getElementById('tour-next-btn');
        if (stepIndex === this.tourSteps.length - 1) {
            nextBtn.innerHTML = 'Finish <i class="fas fa-check"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        }
        
        // Position popup
        this.positionPopup(targetElement, step.position);
    }
    
    /**
     * Position the popup relative to the target element
     * @param {Element} targetElement - The element to position relative to
     * @param {string} position - The position (top, right, bottom, left)
     */
    positionPopup(targetElement, position) {
        const targetRect = targetElement.getBoundingClientRect();
        const popupRect = this.tourPopup.getBoundingClientRect();
        
        let top, left;
        
        switch (position) {
            case 'top':
                top = targetRect.top - popupRect.height - 20;
                left = targetRect.left + (targetRect.width / 2) - (popupRect.width / 2);
                break;
            case 'right':
                top = targetRect.top + (targetRect.height / 2) - (popupRect.height / 2);
                left = targetRect.right + 20;
                break;
            case 'bottom':
                top = targetRect.bottom + 20;
                left = targetRect.left + (targetRect.width / 2) - (popupRect.width / 2);
                break;
            case 'left':
                top = targetRect.top + (targetRect.height / 2) - (popupRect.height / 2);
                left = targetRect.left - popupRect.width - 20;
                break;
            default:
                top = targetRect.bottom + 20;
                left = targetRect.left + (targetRect.width / 2) - (popupRect.width / 2);
        }
        
        // Ensure popup stays within viewport
        if (top < 10) top = 10;
        if (left < 10) left = 10;
        if (top + popupRect.height > window.innerHeight - 10) {
            top = window.innerHeight - popupRect.height - 10;
        }
        if (left + popupRect.width > window.innerWidth - 10) {
            left = window.innerWidth - popupRect.width - 10;
        }
        
        this.tourPopup.style.top = `${top}px`;
        this.tourPopup.style.left = `${left}px`;
    }
    
    /**
     * Move to the next step in the tour
     */
    nextStep() {
        if (this.currentStep < this.tourSteps.length - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        } else {
            this.endTour();
        }
    }
    
    /**
     * Move to the previous step in the tour
     */
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }
}

// Initialize tour when document is ready
document.addEventListener('DOMContentLoaded', function() {
    const tour = new GuidedTour();
    tour.init();
    
    // Make tour available globally
    window.guidedTour = tour;
});