# Indian Meal Calculator

A comprehensive web application for planning and tracking your complete daily nutrition with a focus on Indian foods. This enhanced version includes advanced features like food image recognition, barcode scanning, and integration with free nutrition APIs, plus a comprehensive Indian foods database.

## ✨ Features

### 🍽️ Core Functionality
- **Complete Meal Planning**: Plan breakfast, lunch, dinner, and snacks
- **Real-time Nutrition Tracking**: Track calories, protein, carbs, and fats
- **Daily Goals Management**: Set and monitor nutrition targets
- **Progress Visualization**: Visual progress bars and nutrition summaries

### 🔍 Food Search & Recognition
- **USDA Food Database API**: Search from a comprehensive food database with excellent Indian food coverage (no API key required)
- **Indian Foods Database**: Comprehensive local database of Indian dishes, snacks, and traditional foods
- **Image Capture & Recognition**: Take photos of food for automatic recognition
- **Barcode Scanning**: Scan product barcodes for quick food lookup using USDA and Open Food Facts databases
- **Manual Barcode Entry**: Enter barcode numbers manually
- **Smart Search**: Debounced search with loading states and error handling

### 📱 Enhanced User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Real-time Updates**: Instant nutrition calculations and progress tracking
- **Data Persistence**: Save meal plans locally in your browser
- **Export Functionality**: Download meal plans as JSON files

### 🎯 Advanced Features
- **Preset Goals**: Quick setup for weight loss, maintenance, muscle gain, and athletic performance
- **Meal Breakdown**: Visual breakdown of calories by meal
- **Keyboard Shortcuts**: Quick actions with keyboard commands
- **Error Handling**: Comprehensive error messages and fallback options

## 🚀 Getting Started

### Prerequisites
- Modern web browser with camera access (for image capture)
- Internet connection (for food database API)

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Allow camera permissions when prompted (for image capture feature)

### Usage

#### Adding Foods
1. Click "Add Food Item" in any meal section
2. Use one of these methods:
   - **Search**: Type food name and select from results
   - **Camera**: Click camera icon to capture food image
   - **Barcode**: Click barcode icon to scan product barcode
3. Adjust portion size and unit
4. Click "Add Food" to add to your meal

#### Setting Goals
1. Navigate to "Daily Goals" tab
2. Choose a preset or set custom values
3. Click "Save Goals" to apply

#### Managing Data
- **Save Plan**: Stores current meal plan in browser
- **Export**: Downloads meal plan as JSON file
- **Clear All**: Removes all foods from all meals

## 🔧 Technical Details

### APIs Used
- **USDA Food Database API**: Free, no authentication required
  - Provides comprehensive nutrition data with excellent Indian food coverage
  - Includes Foundation and SR Legacy datasets
  - Automatic data transformation for app compatibility
  - Barcode lookup support for quick product identification
- **Open Food Facts API**: Free fallback for international products
  - Provides global nutrition data for packaged products
  - Used as secondary source for barcode scanning
- **Indian Foods Database**: Local comprehensive database
  - 48+ traditional Indian dishes and foods
  - Includes rice dishes, curries, breads, snacks, and desserts
  - Accurate nutrition information for Indian cuisine

### Image Recognition
- **Simulated Recognition**: Currently shows common foods for demonstration
- **Extensible**: Ready for integration with real AI services
- **Error Handling**: Graceful fallback to manual search

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: iOS Safari, Chrome Mobile
- **Camera Access**: Required for image capture feature

## 🛠️ Customization

### Adding Real Food Recognition
To integrate with a real food recognition API:

1. Sign up for a free API service (e.g., Imagga, Clarifai)
2. Replace the simulated recognition in `recognizeFoodFromImage()` method
3. Update API keys in the constants section

### Styling
- Modify `styles.css` for custom appearance
- Uses CSS Grid and Flexbox for responsive layout
- Custom CSS variables for easy theming

## 📊 Data Structure

### Meal Data
```javascript
{
  id: "unique_id",
  name: "Food Name",
  portion: 100,
  unit: "g",
  calories: 150,
  protein: 10,
  carbs: 20,
  fats: 5
}
```

### Daily Goals
```javascript
{
  calories: 2000,
  protein: 150,
  carbs: 250,
  fats: 67
}
```

## 🔒 Privacy & Security

- **Local Storage**: All data stored locally in your browser
- **No Server**: No data sent to external servers (except food database API)
- **Camera Access**: Only used for image capture, not stored or transmitted

## 🐛 Troubleshooting

### Common Issues

**Camera not working:**
- Ensure browser has camera permissions
- Try refreshing the page
- Check if camera is being used by another application

**Food search not working:**
- Check internet connection
- Try different search terms
- USDA API may have temporary issues
- Try searching for specific Indian food names (e.g., "dal", "roti", "biryani")

**Data not saving:**
- Ensure browser supports localStorage
- Check if private/incognito mode is enabled

### Browser Support
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 11+)
- **Edge**: Full support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- USDA Food Database for providing comprehensive nutrition data
- Open Food Facts for providing global nutrition data
- Font Awesome for icons
- Google Fonts for typography
- Quagga.js for barcode scanning functionality

---

**Note**: This application is for educational and personal use. Always consult with healthcare professionals for dietary advice.
