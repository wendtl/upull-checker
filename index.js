import puppeteer from 'puppeteer'

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://upullrparts.com/inventory/');

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  await page.click('#searchPartButton');

  console.log('Selecting Vehicle...')
  await page.waitForNetworkIdle()
  await page.select('#years', '2009')

  await page.waitForNetworkIdle()
  await page.select('#makes', 'Honda')

  await page.waitForNetworkIdle()
  await page.select('#models', 'PILOT')

  await page.waitForNetworkIdle()
  await page.select('#parts', '275')

  await page.click('#icSubmit')
  console.log('Submitting Form...')

  await page.waitForNetworkIdle()
  await page.click('#fitmentOptions > button')

  await page.waitForNetworkIdle()
  await page.click('#fitmentDisclaimerOK')
  console.log('Waiting for vehicle results...')

  // U-Pull has two locations, which is why there are two vehicle tables
  const rows = await page.$$eval('#vehicletable1 > tbody > tr, #vehicletable2 > tbody > tr', rows => {
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, column => column.innerText);
    });
  })

  // TODO: maybe do something more useful with the output
  console.log(rows)

  await browser.close()
})();
