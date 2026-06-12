import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();

  // Capture all console messages
  page.on('console', msg => {
    console.log(`PAGE LOG [${msg.type()}]:`, msg.text());
  });

  // Capture page errors (unhandled exceptions)
  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  // Capture unhandled page errors
  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    console.log(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
  });

  const url = 'https://fast-engineering-pwa.vercel.app';
  console.log(`Navigating to ${url} ...`);
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  await page.evaluate(() => {
    localStorage.setItem('fes_onboarding_complete', 'true');
  });
  console.log('Set onboarding complete. Reloading...');
  
  // Reload the page and wait for it to finish
  await page.reload({ waitUntil: 'networkidle2' });
  
  console.log('Page loaded. Waiting 5 seconds...');
  await new Promise(r => setTimeout(r, 5000));
  
  const appHtml = await page.evaluate(() => {
    const el = document.getElementById('app');
    return el ? el.innerHTML : 'NULL';
  });
  console.log('APP HTML (after 5s):', appHtml.substring(0, 500));

  console.log('Done.');
  await browser.close();
  console.log('Done.');
})();
