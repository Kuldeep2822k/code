/**
 * keyboard-shortcuts.js - Keyboard shortcuts for the Indian Meal Calculator
 * This script adds keyboard shortcuts for common actions and displays a help modal
 */

class KeyboardShortcuts {
    constructor() {
        // Define shortcuts
        this.shortcuts = {
            // Navigation shortcuts
            'Alt+1': { description: 'Switch to Meal Planner tab', action: () => this.switchTab('planner') },
            'Alt+2': { description: 'Switch to Nutrition Summary tab', action: () => this.switchTab('nutrition') },
            'Alt+3': { description: 'Switch to Daily Goals tab', action: () => this.switchTab('goals') },
            
            // Meal section shortcuts
            'Alt+B': { description: 'Add food to Breakfast', action: () => this.showFoodSelector('breakfast') },
            'Alt+M': { description: 'Add food to Morning Snack', action: () => this.showFoodSelector('morning-snack') },
            'Alt+L': { description: 'Add food to Lunch', action: () => this.showFoodSelector('lunch') },
            'Alt+A': { description: 'Add food to Afternoon Snack', action: () => this.showFoodSelector('afternoon-snack') },
            'Alt+D': { description: 'Add food to Dinner', action: () => this.showFoodSelector('dinner') },
            'Alt+E': { description: 'Add food to Evening Snack', action: () => this.showFoodSelector('evening-snack') },
            
            // Food search shortcuts
            'Alt+S': { description: 'Focus search box in food selector', action: () => this.focusSearch() },
            'Alt+F': { description: 'Open food selector', action: () => this.openFoodSelector() },
            'Escape': { description: 'Close current modal', action: () => this.closeModal() },
            
            // Special features
            'Alt+P': { description: 'Export meal plan as PDF', action: () => this.exportPDF() },
            'Alt+T': { description: 'Start guided tour', action: () => this.startTour() },
            'Alt+G': { description: 'Show sample meal plans gallery', action: () => this.showMealPlans() },
            'Alt+R': { description: 'Open Recipe Calculator', action: () => window.recipeCalculator?.openModal() },
            
            // Help
            '?': { description: 'Show keyboard shortcuts help', action: () => this.showShortcutsHelp() },
            'Alt+H': { description: 'Show keyboard shortcuts help', action: () => this.showShortcutsHelp() }
        };
        
        this.init();
    }
    
    /**
     * Initialize keyboard shortcuts
     */
    init() {
        // Create shortcuts help modal
        this.createShortcutsModal();
        
        // Add keyboard event listener
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Add help button to UI
        this.addHelpButton();
    }
    
    /**
     * Handle keyboard events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyPress(event) {
        // Don't trigger shortcuts when typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            // Allow Escape key in inputs and recipe modal
            if (event.key === 'Escape' && window.recipeCalculator) {
                window.recipeCalculator.closeModal();
            }
            if (event.key !== 'Escape') {
                return;
            }
        }
        
        // Check for question mark without modifiers
        if (event.key === '?' && !event.altKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            this.showShortcutsHelp();
            return;
        }
        
        // Check for Alt+key combinations
        if (event.altKey) {
            const shortcutKey = `Alt+${event.key.toUpperCase()}`;
            if (this.shortcuts[shortcutKey]) {
                event.preventDefault();
                this.shortcuts[shortcutKey].action();
                return;
            }
        }
        
        // Check for Escape key
        if (event.key === 'Escape' && this.shortcuts['Escape']) {
            this.shortcuts['Escape'].action();
        }
    }
    
    /**
     * Switch to a specific tab
     * @param {string} tabId - Tab ID to switch to
     */
    switchTab(tabId) {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }
    
    /**
     * Show food selector for a specific meal
     * @param {string} mealType - Meal type
     */
    showFoodSelector(mealType) {
        const addButton = document.querySelector(`.meal-section h3:contains("${this.getMealTitle(mealType)}") + .meal-items + .add-item-btn`);
        if (!addButton) {
            // Try alternative selector
            const mealSection = Array.from(document.querySelectorAll('.meal-section')).find(section => {
                return section.querySelector('h3').textContent.includes(this.getMealTitle(mealType));
            });
            
            if (mealSection) {
                const addButton = mealSection.querySelector('.add-item-btn');
                if (addButton) {
                    addButton.click();
                }
            }
        } else {
            addButton.click();
        }
    }
    
    /**
     * Get meal title from meal type
     * @param {string} mealType - Meal type
     * @returns {string} - Meal title
     */
    getMealTitle(mealType) {
        const mealTitles = {
            'breakfast': 'Breakfast',
            'morning-snack': 'Morning Snack',
            'lunch': 'Lunch',
            'afternoon-snack': 'Afternoon Snack',
            'dinner': 'Dinner',
            'evening-snack': 'Evening Snack'
        };
        
        return mealTitles[mealType] || mealType;
    }
    
    /**
     * Focus search box in food selector
     */
    focusSearch() {
        const foodSelector = document.getElementById('food-selector');
        if (foodSelector && foodSelector.style.display !== 'none') {
            const searchInput = foodSelector.querySelector('#food-search');
            if (searchInput) {
                searchInput.focus();
            }
        } else {
            // If food selector is not open, open it first
            this.openFoodSelector();
            
            // Focus search after a short delay
            setTimeout(() => {
                const searchInput = document.querySelector('#food-search');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 100);
        }
    }
    
    /**
     * Open food selector
     */
    openFoodSelector() {
        // Default to breakfast if no meal is specified
        this.showFoodSelector('breakfast');
    }
    
    /**
     * Close current modal
     */
    closeModal() {
        // Find visible modals
        const visibleModals = Array.from(document.querySelectorAll('.modal')).filter(modal => {
            return modal.style.display === 'block' || modal.style.display === 'flex';
        });
        
        // Close the last opened modal
        if (visibleModals.length > 0) {
            const lastModal = visibleModals[visibleModals.length - 1];
            const closeBtn = lastModal.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.click();
            } else {
                lastModal.style.display = 'none';
            }
        }
    }
    
    /**
     * Export meal plan as PDF
     */
    exportPDF() {
        // Check if PDF exporter is available
        if (window.pdfExporter) {
            window.pdfExporter.showPDFModal();
        } else {
            console.warn('PDF exporter not available');
        }
    }
    
    /**
     * Start guided tour
     */
    startTour() {
        // Check if tour is available
        if (window.guidedTour) {
            window.guidedTour.startTour();
        } else {
            console.warn('Guided tour not available');
        }
    }
    
    /**
     * Show meal plans gallery
     */
    showMealPlans() {
        // Check if meal plans gallery is available
        if (window.mealPlansGallery) {
            // Switch to nutrition tab first
            this.switchTab('nutrition');
            
            // Show meal plans gallery
            window.mealPlansGallery.showGallery();
        } else {
            console.warn('Meal plans gallery not available');
        }
    }
    
    /**
     * Open recipe calculator
     */
    openRecipeCalculator() {
        if (window.recipeCalculator) {
            window.recipeCalculator.openModal();
        } else {
            console.warn('Recipe calculator not available');
        }
    }

    /**
     * Show keyboard shortcuts help modal
     */
    showShortcutsHelp() {
        const modal = document.getElementById('keyboard-shortcuts-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    /**
     * Create keyboard shortcuts help modal
     */
    createShortcutsModal() {
        // Create modal element
        const modal = document.createElement('div');
        modal.id = 'keyboard-shortcuts-modal';
        modal.className = 'modal';
        
        // Create modal content
        let shortcutGroups = {
            'Navigation': Object.entries(this.shortcuts).filter(([key]) => key.includes('Alt+') && !isNaN(key.slice(4))),
            'Meal Sections': Object.entries(this.shortcuts).filter(([key, value]) => value.description.includes('Add food to')),
            'Food Search': Object.entries(this.shortcuts).filter(([key, value]) => 
                value.description.includes('Focus search') || 
                value.description.includes('Open food') || 
                key === 'Escape'),
            'Special Features': Object.entries(this.shortcuts).filter(([key, value]) => 
                value.description.includes('Export') || 
                value.description.includes('guided tour') || 
                value.description.includes('meal plans') ||
                value.description.includes('Recipe Calculator')),
            'Help': Object.entries(this.shortcuts).filter(([key, value]) => value.description.includes('shortcuts help'))
        };
        
        // Create modal HTML
        let modalHTML = `
            <div class="modal-content keyboard-shortcuts-content">
                <div class="modal-header">
                    <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
                    <span class="close-btn">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Use these keyboard shortcuts to quickly navigate and use the Indian Meal Calculator:</p>
                    
                    <div class="shortcuts-grid">
        `;
        
        // Add each shortcut group
        for (const [groupName, shortcuts] of Object.entries(shortcutGroups)) {
            if (shortcuts.length === 0) continue;
            
            modalHTML += `
                <div class="shortcuts-group">
                    <h4>${groupName}</h4>
                    <div class="shortcuts-list">
            `;
            
            // Add each shortcut in the group
            for (const [key, value] of shortcuts) {
                modalHTML += `
                    <div class="shortcut-item">
                        <span class="shortcut-key">${key}</span>
                        <span class="shortcut-description">${value.description}</span>
                    </div>
                `;
            }
            
            modalHTML += `
                    </div>
                </div>
            `;
        }
        
        modalHTML += `
                    </div>
                    
                    <div class="shortcuts-note">
                        <p><strong>Note:</strong> On Mac, use <strong>Option</strong> instead of <strong>Alt</strong>.</p>
                    </div>
                </div>
            </div>
        `;
        
        // Set modal HTML
        modal.innerHTML = modalHTML;
        
        // Add modal to document
        document.body.appendChild(modal);
        
        // Add event listener for close button
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Add styles for keyboard shortcuts modal
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .keyboard-shortcuts-content {
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .shortcuts-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .shortcuts-group h4 {
                margin-top: 0;
                margin-bottom: 10px;
                color: #FF5722;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 5px;
            }
            
            .shortcuts-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .shortcut-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .shortcut-key {
                background-color: #f1f5f9;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                padding: 2px 8px;
                font-family: monospace;
                font-weight: bold;
                color: #334155;
                min-width: 60px;
                text-align: center;
            }
            
            .shortcut-description {
                flex: 1;
                margin-left: 10px;
                color: #4a5568;
            }
            
            .shortcuts-note {
                margin-top: 20px;
                padding: 10px;
                background-color: #f8fafc;
                border-radius: 5px;
                border-left: 3px solid #FF9800;
            }
            
            .shortcuts-note p {
                margin: 0;
                color: #4a5568;
            }
            
            .keyboard-help-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #FF9800 0%, #FF5722 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3);
                transition: all 0.3s ease;
                z-index: 100;
                border: none;
            }
            
            .keyboard-help-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(255, 87, 34, 0.4);
            }
            
            .keyboard-help-btn i {
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    /**
     * Add help button to UI
     */
    addHelpButton() {
        const helpButton = document.createElement('button');
        helpButton.className = 'keyboard-help-btn';
        helpButton.innerHTML = '<i class="fas fa-keyboard"></i>';
        helpButton.title = 'Keyboard Shortcuts (Press ? for help)';
        
        helpButton.addEventListener('click', () => {
            this.showShortcutsHelp();
        });
        
        document.body.appendChild(helpButton);
    }
}

// Initialize keyboard shortcuts when document is ready
document.addEventListener('DOMContentLoaded', function() {
    const keyboardShortcuts = new KeyboardShortcuts();
    
    // Make shortcuts available globally
    window.keyboardShortcuts = keyboardShortcuts;
});