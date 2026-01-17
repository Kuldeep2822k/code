// Test suite for the Indian Meal Calculator

QUnit.module('RecipeCalculator', function(hooks) {
  let recipeCalculator;

  hooks.beforeEach(function() {
    // This is a workaround since we can't easily instantiate the class
    // without the DOM. We create a mock object with the method we need.
    recipeCalculator = {
      calculateRecipeNutrition: window.RecipeCalculator.prototype.calculateRecipeNutrition
    };
  });

  QUnit.test('calculateRecipeNutrition correctly calculates totals per serving', function(assert) {
    const ingredients = [
      {
        name: 'Rice',
        amount: 200,
        unit: 'g',
        nutrients: { ENERC_KCAL: 130, PROCNT: 2.7, CHOCDF: 28, FAT: 0.3 } // per 100g
      },
      {
        name: 'Dal',
        amount: 1,
        unit: 'cup', // 240g
        nutrients: { ENERC_KCAL: 116, PROCNT: 9, CHOCDF: 20, FAT: 0.4 } // per 100g
      }
    ];
    const servings = 4;

    const nutrition = recipeCalculator.calculateRecipeNutrition(ingredients, servings);

    // Expected totals:
    // Rice: (200/100) * {130, 2.7, 28, 0.3} = {260, 5.4, 56, 0.6}
    // Dal: (240/100) * {116, 9, 20, 0.4} = {278.4, 21.6, 48, 0.96}
    // Total: {538.4, 27, 104, 1.56}
    // Per serving (divided by 4): {134.6, 6.75, 26, 0.39}
    // Rounded: {135, 7, 26, 0}
    assert.deepEqual(nutrition, {
      ENERC_KCAL: 135,
      PROCNT: 7,
      CHOCDF: 26,
      FAT: 0
    }, 'Correctly calculates nutrition for a simple recipe');
  });

  QUnit.test('calculateRecipeNutrition handles ingredients with missing nutrients', function(assert) {
    const ingredients = [
      {
        name: 'Salt',
        amount: 1,
        unit: 'tsp', // 5g
        nutrients: {} // No nutrient info
      },
      {
        name: 'Sugar',
        amount: 2,
        unit: 'tbsp', // 30g
        nutrients: { ENERC_KCAL: 387, CHOCDF: 100 } // Missing protein and fat
      }
    ];
    const servings = 2;

    const nutrition = recipeCalculator.calculateRecipeNutrition(ingredients, servings);

    // Expected totals:
    // Salt: {0, 0, 0, 0}
    // Sugar: (30/100) * {387, 0, 100, 0} = {116.1, 0, 30, 0}
    // Total: {116.1, 0, 30, 0}
    // Per serving (divided by 2): {58.05, 0, 15, 0}
    // Rounded: {58, 0, 15, 0}
    assert.deepEqual(nutrition, {
      ENERC_KCAL: 58,
      PROCNT: 0,
      CHOCDF: 15,
      FAT: 0
    }, 'Handles missing nutrients gracefully');
  });

  QUnit.test('calculateRecipeNutrition handles piece unit', function(assert) {
    const ingredients = [
      {
        name: 'Egg',
        amount: 2,
        unit: 'piece',
        nutrients: { ENERC_KCAL: 155, PROCNT: 13, CHOCDF: 1.1, FAT: 11 } // per piece
      }
    ];
    const servings = 1;

    const nutrition = recipeCalculator.calculateRecipeNutrition(ingredients, servings);

    // Expected totals:
    // Egg: 2 * {155, 13, 1.1, 11} = {310, 26, 2.2, 22}
    // Per serving (divided by 1): {310, 26, 2.2, 22}
    // Rounded: {310, 26, 2, 22}
     assert.deepEqual(nutrition, {
      ENERC_KCAL: 310,
      PROCNT: 26,
      CHOCDF: 2,
      FAT: 22
    }, 'Correctly calculates for "piece" unit');
  });
});

QUnit.module('MealCalculator', function(hooks) {
  let mealCalculator;

  hooks.beforeEach(function() {
    // We can instantiate MealCalculator as its constructor doesn't require the DOM.
    // However, we will mock the methods that interact with the DOM.
    mealCalculator = new MealCalculator();
  });

  QUnit.test('getIndianFoodsDatabase filters correctly', function(assert) {
    assert.equal(mealCalculator.getIndianFoodsDatabase('rice').length, 5, 'Finds all rice dishes');
    assert.equal(mealCalculator.getIndianFoodsDatabase('PANEER').length, 2, 'Finds paneer dishes case-insensitively');
    assert.equal(mealCalculator.getIndianFoodsDatabase('xyz').length, 0, 'Returns empty for no match');
    assert.equal(mealCalculator.getIndianFoodsDatabase('').length, 48, 'Returns all items for empty query');
  });

  QUnit.test('calculateTotalNutrition sums up nutrients from all meals', function(assert) {
    mealCalculator.meals = {
      'breakfast': [{ calories: 300, protein: 10, carbs: 40, fats: 10 }],
      'lunch': [
        { calories: 500, protein: 30, carbs: 60, fats: 20 },
        { calories: 150, protein: 5, carbs: 20, fats: 5 }
      ],
      'dinner': []
    };
    const totals = mealCalculator.calculateTotalNutrition();
    assert.deepEqual(totals, {
      calories: 950,
      protein: 45,
      carbs: 120,
      fats: 35
    }, 'Correctly sums nutrients');
  });

  QUnit.test('calculateTotalNutrition handles empty meals', function(assert) {
    mealCalculator.meals = {
      'breakfast': [],
      'lunch': [],
      'dinner': []
    };
    const totals = mealCalculator.calculateTotalNutrition();
    assert.deepEqual(totals, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    }, 'Returns zero for empty meals');
  });

  QUnit.test('formatMealName formats strings correctly', function(assert) {
    assert.equal(mealCalculator.formatMealName('breakfast'), 'Breakfast', 'Handles single word');
    assert.equal(mealCalculator.formatMealName('morning-snack'), 'Morning Snack', 'Handles hyphenated words');
    assert.equal(mealCalculator.formatMealName(''), '', 'Handles empty string');
  });

  QUnit.test('convertPortionToGrams converts units correctly', function(assert) {
    assert.strictEqual(mealCalculator.convertPortionToGrams(100, 'gram'), 100, 'gram conversion is correct');
    assert.strictEqual(mealCalculator.convertPortionToGrams(1, 'cup'), 240, 'cup conversion is correct');
    assert.close(mealCalculator.convertPortionToGrams(1, 'ounce'), 28.35, 0.01, 'ounce conversion is correct');
    assert.strictEqual(mealCalculator.convertPortionToGrams(1, 'piece'), 100, 'piece conversion is correct');
    assert.strictEqual(mealCalculator.convertPortionToGrams(1, 'tablespoon'), 15, 'tablespoon conversion is correct');
    assert.strictEqual(mealCalculator.convertPortionToGrams(1, 'teaspoon'), 5, 'teaspoon conversion is correct');
    assert.strictEqual(mealCalculator.convertPortionToGrams(1, 'serving'), 100, 'serving conversion is correct');
    assert.strictEqual(mealCalculator.convertPortionToGrams(0, 'cup'), 0, 'Handles zero portion size');
  });
});

QUnit.module('MealCalculator.addFoodItem', function(hooks) {
  let mealCalculator;

  hooks.beforeEach(function() {
    mealCalculator = new MealCalculator();
    // Mock DOM dependent methods to prevent errors during testing
    mealCalculator.renderMealItems = function() {};
    mealCalculator.updateNutritionDisplay = function() {};
    mealCalculator.saveData = function() {};
    mealCalculator.showMessage = function() {};
    mealCalculator.currentMeal = 'breakfast';
  });

  QUnit.test('addFoodItem adds valid item correctly', function(assert) {
    const item = {
      name: 'Test Food',
      calories: 100,
      protein: 10,
      carbs: 20,
      fats: 5,
      portion: 1,
      unit: 'cup'
    };

    const result = mealCalculator.addFoodItem(item);
    assert.true(result, 'Returns true for valid item');
    assert.equal(mealCalculator.meals.breakfast.length, 1, 'Item added to breakfast');

    const added = mealCalculator.meals.breakfast[0];
    assert.equal(added.name, 'Test Food', 'Name matches');
    assert.equal(added.calories, 100, 'Calories match');
  });

  QUnit.test('addFoodItem sanitizes negative values', function(assert) {
    const item = {
      name: 'Negative Food',
      calories: -100,
      protein: -10,
      carbs: 20,
      fats: 5
    };

    mealCalculator.addFoodItem(item);
    const added = mealCalculator.meals.breakfast[0];

    assert.equal(added.calories, 0, 'Negative calories become 0');
    assert.equal(added.protein, 0, 'Negative protein becomes 0');
    assert.equal(added.carbs, 20, 'Positive values remain');
  });

  QUnit.test('addFoodItem handles nested nutrients object', function(assert) {
    const item = {
      label: 'Nested Food',
      nutrients: {
        ENERC_KCAL: 150,
        PROCNT: 15,
        CHOCDF: 25,
        FAT: 6
      }
    };

    mealCalculator.addFoodItem(item);
    const added = mealCalculator.meals.breakfast[0];

    assert.equal(added.name, 'Nested Food', 'Label used as name');
    assert.equal(added.calories, 150, 'Calories extracted from nutrients');
    assert.equal(added.protein, 15, 'Protein extracted from nutrients');
  });

  QUnit.test('addFoodItem limits name length', function(assert) {
    const longName = 'A'.repeat(150);
    const item = {
      name: longName,
      calories: 100
    };

    mealCalculator.addFoodItem(item);
    const added = mealCalculator.meals.breakfast[0];

    assert.equal(added.name.length, 100, 'Name truncated to 100 chars');
    assert.equal(added.name, 'A'.repeat(100), 'Name matches truncated string');
  });

  QUnit.test('addFoodItem fails if no meal selected', function(assert) {
    mealCalculator.currentMeal = '';
    const result = mealCalculator.addFoodItem({ name: 'Food' });
    assert.false(result, 'Returns false when no current meal');
    assert.equal(mealCalculator.meals.breakfast.length, 0, 'No item added');
  });
});
