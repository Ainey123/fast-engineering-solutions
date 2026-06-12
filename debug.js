import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log(`PAGE LOG: ${msg.type()} - ${msg.text()}`);
  });

  // Capture unhandled page errors
  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    console.log(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
  });

  console.log('Navigating to https://Ainey123.github.io/fast-engineering-solutions/ ...');
  await page.goto('https://Ainey123.github.io/fast-engineering-solutions/', { waitUntil: 'networkidle2' });
  
  console.log('Page loaded. Waiting a bit...');
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
  console.log('Done.');
})();
