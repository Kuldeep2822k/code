/**
 * pdf-export.js - PDF export functionality for the Indian Meal Calculator
 * This script adds the ability to export meal plans as printable PDF documents
 */

// Define PDFExporter using IIFE to prevent global scope pollution
(() => {
    // Skip if already initialized
    if (window.pdfExporter) return;

    // Define class in local scope
    const PDFExporter = class {

    constructor() {
        this.init();
    }
    
    /**
     * Initialize the PDF exporter
     */
    init() {
        // Add export button to the UI
        this.addExportButton();
        
        // Load jsPDF library
        this.loadJsPDF();
        
        // Add event listeners
        this.addEventListeners();
    }
    
    /**
     * Add export button to the UI
     */
    addExportButton() {
        // Add export button to nutrition summary tab
        const nutritionSummaryTab = document.getElementById('nutrition-summary');
        if (nutritionSummaryTab) {
            const exportButton = document.createElement('button');
            exportButton.id = 'export-pdf-btn';
            exportButton.className = 'action-btn export-btn';
            exportButton.innerHTML = '<i class="fas fa-file-pdf"></i> Export as PDF';
            
            // Find a good place to add the button
            const actionButtons = nutritionSummaryTab.querySelector('.action-buttons');
            if (actionButtons) {
                actionButtons.appendChild(exportButton);
            } else {
                // Create action buttons container if it doesn't exist
                const actionButtonsContainer = document.createElement('div');
                actionButtonsContainer.className = 'action-buttons';
                actionButtonsContainer.appendChild(exportButton);
                
                // Add after charts section or nutrition cards
                const chartsSection = nutritionSummaryTab.querySelector('.charts-section');
                if (chartsSection) {
                    chartsSection.parentNode.insertBefore(actionButtonsContainer, chartsSection.nextSibling);
                } else {
                    const nutritionCards = nutritionSummaryTab.querySelector('.nutrition-cards');
                    if (nutritionCards) {
                        nutritionCards.parentNode.insertBefore(actionButtonsContainer, nutritionCards.nextSibling);
                    } else {
                        nutritionSummaryTab.appendChild(actionButtonsContainer);
                    }
                }
            }
            
            // Add styles for export button
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .action-buttons {
                    display: flex;
                    justify-content: center;
                    margin: 30px 0;
                    gap: 15px;
                }
                
                .export-btn {
                    background: linear-gradient(135deg, #FF5722 0%, #FF9800 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 30px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3);
                    transition: all 0.3s ease;
                }
                
                .export-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(255, 87, 34, 0.4);
                }
                
                .export-btn i {
                    font-size: 1.2rem;
                }
                
                /* PDF Modal Styles */
                .pdf-modal {
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
                
                .pdf-modal-content {
                    background-color: white;
                    margin: 50px auto;
                    padding: 30px;
                    border-radius: 10px;
                    max-width: 600px;
                    position: relative;
                }
                
                .close-pdf-modal {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #718096;
                }
                
                .pdf-options {
                    margin-top: 20px;
                }
                
                .pdf-option-group {
                    margin-bottom: 20px;
                }
                
                .pdf-option-group h3 {
                    margin-top: 0;
                    margin-bottom: 10px;
                    color: #4a5568;
                    font-size: 1.1rem;
                }
                
                .pdf-option-items {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                
                .pdf-checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .pdf-checkbox-item label {
                    font-size: 0.9rem;
                    color: #4a5568;
                }
                
                .pdf-text-field {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #e2e8f0;
                    border-radius: 5px;
                    margin-top: 5px;
                    font-family: inherit;
                }
                
                .pdf-modal-actions {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 30px;
                }
                
                .pdf-modal-btn {
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    border: none;
                }
                
                .generate-pdf-btn {
                    background-color: #FF5722;
                    color: white;
                }
                
                .generate-pdf-btn:hover {
                    background-color: #E64A19;
                }
                
                .cancel-pdf-btn {
                    background-color: #e2e8f0;
                    color: #4a5568;
                }
                
                .cancel-pdf-btn:hover {
                    background-color: #cbd5e0;
                }
            `;
            document.head.appendChild(styleElement);
        }
        
        // Create PDF export modal
        this.createPDFModal();
    }
    
    /**
     * Create PDF export options modal
     */
    createPDFModal() {
        const modal = document.createElement('div');
        modal.className = 'pdf-modal';
        modal.id = 'pdf-export-modal';
        
        modal.innerHTML = `
            <div class="pdf-modal-content">
                <span class="close-pdf-modal">&times;</span>
                <h2>Export Meal Plan as PDF</h2>
                <p>Customize your PDF export options below:</p>
                
                <div class="pdf-options">
                    <div class="pdf-option-group">
                        <h3>Content to Include</h3>
                        <div class="pdf-option-items">
                            <div class="pdf-checkbox-item">
                                <input type="checkbox" id="include-summary" checked>
                                <label for="include-summary">Nutrition Summary</label>
                            </div>
                            <div class="pdf-checkbox-item">
                                <input type="checkbox" id="include-meals" checked>
                                <label for="include-meals">Meal Details</label>
                            </div>
                            <div class="pdf-checkbox-item">
                                <input type="checkbox" id="include-charts" checked>
                                <label for="include-charts">Nutrition Charts</label>
                            </div>
                            <div class="pdf-checkbox-item">
                                <input type="checkbox" id="include-goals" checked>
                                <label for="include-goals">Daily Goals</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pdf-option-group">
                        <h3>Document Information</h3>
                        <div>
                            <label for="pdf-title">Title</label>
                            <input type="text" id="pdf-title" class="pdf-text-field" value="My Indian Meal Plan">
                        </div>
                        <div style="margin-top: 10px;">
                            <label for="pdf-notes">Notes (optional)</label>
                            <textarea id="pdf-notes" class="pdf-text-field" rows="3" placeholder="Add any notes or comments about this meal plan..."></textarea>
                        </div>
                    </div>
                    
                    <div class="pdf-option-group">
                        <h3>PDF Options</h3>
                        <div class="pdf-option-items">
                            <div class="pdf-checkbox-item">
                                <input type="checkbox" id="include-date" checked>
                                <label for="include-date">Include Date</label>
                            </div>
                            <div class="pdf-checkbox-item">
                                <input type="checkbox" id="include-page-numbers" checked>
                                <label for="include-page-numbers">Page Numbers</label>
                            </div>
                            <div class="pdf-checkbox-item">
                                <input type="checkbox" id="include-logo" checked>
                                <label for="include-logo">Include Logo</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="pdf-modal-actions">
                    <button class="pdf-modal-btn generate-pdf-btn">
                        <i class="fas fa-file-pdf"></i> Generate PDF
                    </button>
                    <button class="pdf-modal-btn cancel-pdf-btn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    /**
     * Load jsPDF library dynamically
     */
    loadJsPDF() {
        // Check if jsPDF is already loaded
        if (window.jspdf) return;
        
        // Load jsPDF library
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.integrity = 'sha512-qZvrmS2ekKPF2mSznTQsxqPgnpkI4DNTlrdUmTzrDgektczlKNRRhy5X5AAOnx5S09ydFYWWNSfcEqDTTHgtNA==';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        
        // Load html2canvas library for chart capture
        const html2canvasScript = document.createElement('script');
        html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        html2canvasScript.integrity = 'sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==';
        html2canvasScript.crossOrigin = 'anonymous';
        document.head.appendChild(html2canvasScript);
    }
    
    /**
     * Add event listeners for PDF export functionality
     */
    addEventListeners() {
        // Show PDF export modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('#export-pdf-btn')) {
                this.showPDFModal();
            }
        });
        
        // Close PDF export modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('.close-pdf-modal') || e.target.matches('.cancel-pdf-btn')) {
                this.closePDFModal();
            }
        });
        
        // Generate PDF
        document.addEventListener('click', (e) => {
            if (e.target.closest('.generate-pdf-btn')) {
                this.generatePDF();
            }
        });
    }
    
    /**
     * Show the PDF export modal
     */
    showPDFModal() {
        const modal = document.getElementById('pdf-export-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    /**
     * Close the PDF export modal
     */
    closePDFModal() {
        const modal = document.getElementById('pdf-export-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    /**
     * Generate PDF based on selected options
     */
    async generatePDF() {
        // Check if jsPDF and html2canvas are loaded
        if (!window.jspdf || !window.html2canvas) {
            alert('PDF libraries are still loading. Please try again in a moment.');
            return;
        }
        
        // Get options from modal
        const includeSummary = document.getElementById('include-summary').checked;
        const includeMeals = document.getElementById('include-meals').checked;
        const includeCharts = document.getElementById('include-charts').checked;
        const includeGoals = document.getElementById('include-goals').checked;
        const includeDate = document.getElementById('include-date').checked;
        const includePageNumbers = document.getElementById('include-page-numbers').checked;
        const includeLogo = document.getElementById('include-logo').checked;
        const title = document.getElementById('pdf-title').value || 'My Indian Meal Plan';
        const notes = document.getElementById('pdf-notes').value || '';
        
        // Create new PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Set document properties
        doc.setProperties({
            title: title,
            subject: 'Meal Plan',
            author: 'Indian Meal Calculator',
            keywords: 'meal plan, nutrition, indian food',
            creator: 'Indian Meal Calculator'
        });
        
        // Define page dimensions
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);
        
        // Track current Y position
        let yPos = margin;
        let pageNum = 1;
        
        // Add header with logo
        if (includeLogo) {
            // Create a simple logo using text (in a real app, you'd use an image)
            doc.setFillColor(255, 87, 34);
            doc.rect(margin, yPos, 15, 15, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.text('IMC', margin + 3, yPos + 10);
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(24);
            doc.text(title, margin + 20, yPos + 10);
            yPos += 20;
        } else {
            doc.setFontSize(24);
            doc.text(title, margin, yPos + 10);
            yPos += 20;
        }
        
        // Add date
        if (includeDate) {
            const today = new Date();
            const dateStr = today.toLocaleDateString();
            doc.setFontSize(10);
            doc.text(`Date: ${dateStr}`, margin, yPos);
            yPos += 10;
        }
        
        // Add notes if provided
        if (notes) {
            doc.setFontSize(12);
            doc.text('Notes:', margin, yPos);
            yPos += 5;
            
            // Split notes into lines that fit within content width
            const noteLines = doc.splitTextToSize(notes, contentWidth);
            doc.setFontSize(10);
            doc.text(noteLines, margin, yPos);
            yPos += (noteLines.length * 5) + 10;
        }
        
        // Get meal calculator instance
        const mealCalculator = window.mealCalculator;
        if (!mealCalculator) {
            alert('Meal calculator not found. Cannot generate PDF.');
            return;
        }
        
        // Add nutrition summary
        if (includeSummary) {
            // Add section title
            this.addSectionTitle(doc, 'Nutrition Summary', margin, yPos);
            yPos += 10;
            
            // Get nutrition totals
            const totals = mealCalculator.calculateTotalNutrition();
            
            // Create nutrition summary table
            const nutritionData = [
                ['Nutrient', 'Amount', 'Daily Goal', '% of Goal'],
                ['Calories', `${totals.calories} kcal`, `${mealCalculator.dailyGoals.calories} kcal`, `${Math.round((totals.calories / mealCalculator.dailyGoals.calories) * 100)}%`],
                ['Protein', `${totals.protein} g`, `${mealCalculator.dailyGoals.protein} g`, `${Math.round((totals.protein / mealCalculator.dailyGoals.protein) * 100)}%`],
                ['Carbs', `${totals.carbs} g`, `${mealCalculator.dailyGoals.carbs} g`, `${Math.round((totals.carbs / mealCalculator.dailyGoals.carbs) * 100)}%`],
                ['Fat', `${totals.fats} g`, `${mealCalculator.dailyGoals.fats} g`, `${Math.round((totals.fats / mealCalculator.dailyGoals.fats) * 100)}%`]
            ];
            
            doc.autoTable({
                head: [nutritionData[0]],
                body: nutritionData.slice(1),
                startY: yPos,
                margin: { left: margin, right: margin },
                theme: 'grid',
                headStyles: { fillColor: [255, 87, 34], textColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [245, 245, 245] }
            });
            
            yPos = doc.lastAutoTable.finalY + 10;
        }
        
        // Add nutrition charts if available and selected
        if (includeCharts && window.nutritionCharts) {
            // Check if we need a new page
            if (yPos > pageHeight - 100) {
                doc.addPage();
                yPos = margin;
                pageNum++;
            }
            
            // Add section title
            this.addSectionTitle(doc, 'Nutrition Charts', margin, yPos);
            yPos += 10;
            
            try {
                // Capture macro distribution chart
                const macroChart = document.getElementById('macro-distribution-chart');
                if (macroChart) {
                    const macroCanvas = await html2canvas(macroChart);
                    const macroImgData = macroCanvas.toDataURL('image/png');
                    doc.addImage(macroImgData, 'PNG', margin, yPos, contentWidth / 2 - 5, 60);
                }
                
                // Capture meal breakdown chart
                const mealChart = document.getElementById('meal-breakdown-chart');
                if (mealChart) {
                    const mealCanvas = await html2canvas(mealChart);
                    const mealImgData = mealCanvas.toDataURL('image/png');
                    doc.addImage(mealImgData, 'PNG', margin + contentWidth / 2 + 5, yPos, contentWidth / 2 - 5, 60);
                }
                
                yPos += 70;
                
                // Capture weekly trend chart
                const weeklyChart = document.getElementById('weekly-trend-chart');
                if (weeklyChart) {
                    // Check if we need a new page
                    if (yPos > pageHeight - 80) {
                        doc.addPage();
                        yPos = margin;
                        pageNum++;
                    }
                    
                    const weeklyCanvas = await html2canvas(weeklyChart);
                    const weeklyImgData = weeklyCanvas.toDataURL('image/png');
                    doc.addImage(weeklyImgData, 'PNG', margin, yPos, contentWidth, 60);
                    yPos += 70;
                }
            } catch (error) {
                console.error('Error capturing charts:', error);
            }
        }
        
        // Add meal details
        if (includeMeals) {
            // Check if we need a new page
            if (yPos > pageHeight - 60) {
                doc.addPage();
                yPos = margin;
                pageNum++;
            }
            
            // Add section title
            this.addSectionTitle(doc, 'Meal Details', margin, yPos);
            yPos += 10;
            
            // Define meal types
            const mealTypes = {
                'breakfast': 'Breakfast',
                'morning-snack': 'Morning Snack',
                'lunch': 'Lunch',
                'afternoon-snack': 'Afternoon Snack',
                'dinner': 'Dinner',
                'evening-snack': 'Evening Snack'
            };
            
            // Add each meal section
            for (const [mealKey, mealName] of Object.entries(mealTypes)) {
                const mealItems = mealCalculator.meals[mealKey] || [];
                if (mealItems.length === 0) continue;
                
                // Check if we need a new page
                if (yPos > pageHeight - 40) {
                    doc.addPage();
                    yPos = margin;
                    pageNum++;
                }
                
                // Add meal title
                doc.setFontSize(14);
                doc.setTextColor(255, 87, 34);
                doc.text(mealName, margin, yPos);
                doc.setTextColor(0, 0, 0);
                yPos += 8;
                
                // Create meal items table
                const mealData = [
                    ['Food Item', 'Quantity', 'Calories', 'Protein', 'Carbs', 'Fat']
                ];
                
                mealItems.forEach(item => {
                    mealData.push([
                        item.label,
                        `${item.quantity} ${item.measure}`,
                        `${item.nutrition.calories} kcal`,
                        `${item.nutrition.protein} g`,
                        `${item.nutrition.carbs} g`,
                        `${item.nutrition.fats} g`
                    ]);
                });
                
                doc.autoTable({
                    head: [mealData[0]],
                    body: mealData.slice(1),
                    startY: yPos,
                    margin: { left: margin, right: margin },
                    theme: 'striped',
                    headStyles: { fillColor: [255, 152, 0], textColor: [255, 255, 255] },
                    bodyStyles: { fontSize: 9 },
                    columnStyles: {
                        0: { cellWidth: 50 },
                        1: { cellWidth: 30 },
                        2: { cellWidth: 25 },
                        3: { cellWidth: 25 },
                        4: { cellWidth: 25 },
                        5: { cellWidth: 25 }
                    }
                });
                
                yPos = doc.lastAutoTable.finalY + 10;
            }
        }
        
        // Add daily goals
        if (includeGoals) {
            // Check if we need a new page
            if (yPos > pageHeight - 60) {
                doc.addPage();
                yPos = margin;
                pageNum++;
            }
            
            // Add section title
            this.addSectionTitle(doc, 'Daily Nutrition Goals', margin, yPos);
            yPos += 10;
            
            // Create goals table
            const goalsData = [
                ['Nutrient', 'Goal'],
                ['Calories', `${mealCalculator.dailyGoals.calories} kcal`],
                ['Protein', `${mealCalculator.dailyGoals.protein} g`],
                ['Carbs', `${mealCalculator.dailyGoals.carbs} g`],
                ['Fat', `${mealCalculator.dailyGoals.fats} g`]
            ];
            
            doc.autoTable({
                head: [goalsData[0]],
                body: goalsData.slice(1),
                startY: yPos,
                margin: { left: margin, right: margin },
                theme: 'grid',
                headStyles: { fillColor: [76, 175, 80], textColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [240, 249, 232] }
            });
            
            yPos = doc.lastAutoTable.finalY + 10;
        }
        
        // Add footer with page numbers
        if (includePageNumbers) {
            const totalPages = pageNum;
            
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(128, 128, 128);
                doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }
        }
        
        // Save the PDF
        doc.save(`${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
        
        // Close the modal
        this.closePDFModal();
    }
    
    /**
     * Add a section title to the PDF
     * @param {Object} doc - jsPDF document instance
     * @param {string} title - Section title
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    addSectionTitle(doc, title, x, y) {
        doc.setFontSize(16);
        doc.setTextColor(33, 150, 243);
        doc.text(title, x, y);
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const lineWidth = pageWidth - (x * 2);
        
        doc.setDrawColor(33, 150, 243);
        doc.setLineWidth(0.5);
        doc.line(x, y + 1, x + lineWidth, y + 1);
        
        doc.setTextColor(0, 0, 0);
    }
}

    // Initialize when DOM is ready
    const initialize = () => {
        if (!window.pdfExporter) {
            window.pdfExporter = new PDFExporter();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();