const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // Use new headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for some CI environments
  });
  const page = await browser.newPage();

  // Log console messages from the browser to the Node console
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  const testPath = path.join(__dirname, 'tests', 'tests.html');
  const url = `file://${testPath}`;

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Wait for QUnit to finish
  await page.waitForFunction(() => {
    return window.QUnit && window.QUnit.config && window.QUnit.config.queue && window.QUnit.config.queue.length === 0;
  }, { timeout: 10000 });

  // Extract results and failed tests
  const results = await page.evaluate(() => {
    const resultElement = document.getElementById('qunit-testresult');
    if (!resultElement) return null;

    const passed = parseInt(resultElement.querySelector('.passed').textContent, 10);
    const failed = parseInt(resultElement.querySelector('.failed').textContent, 10);
    const total = parseInt(resultElement.querySelector('.total').textContent, 10);

    const failedTests = [];
    if (failed > 0) {
        document.querySelectorAll('#qunit-tests > .fail').forEach(li => {
            const moduleName = li.querySelector('.module-name') ? li.querySelector('.module-name').textContent : '';
            const testName = li.querySelector('.test-name') ? li.querySelector('.test-name').textContent : '';

            // Iterate over failed assertions
            li.querySelectorAll('ol > li.fail').forEach(assertion => {
                 const message = assertion.querySelector('.test-message') ? assertion.querySelector('.test-message').textContent : 'No message';
                 const expected = assertion.querySelector('.test-expected pre') ? assertion.querySelector('.test-expected pre').textContent : 'N/A';
                 const actual = assertion.querySelector('.test-actual pre') ? assertion.querySelector('.test-actual pre').textContent : 'N/A';
                 failedTests.push(`${moduleName}: ${testName} - ${message}\n    Expected: ${expected}\n    Actual: ${actual}`);
            });
        });
    }

    return {
      passed,
      failed,
      total,
      failedTests
    };
  });

  await browser.close();

  if (!results) {
    console.error('Could not find QUnit results.');
    process.exit(1);
  }

  console.log('Test Results:');
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Total: ${results.total}`);

  if (results.failed > 0) {
    console.error('Tests failed!');
    results.failedTests.forEach(test => console.error(` - ${test}`));
    process.exit(1);
  } else {
    console.log('All tests passed!');
    process.exit(0);
  }
})();
