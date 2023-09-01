import puppeteer from 'puppeteer'

const BACK_GLASS = 275 // Hardcoded part number


/**
 * Query the most(?) popular junkyard in Minnesota's online inventory for parts that fit a specific vehicle
 * @param year the model year of the vehicle
 * @param make the brand of the vehicle
 * @param model the model name of the vehicle
 * @param partId references an arbitrary part number set by the U Pull website (sorry)
 * @returns 2-dimensional list of in-stock vehicles that may have compatible parts
 */
const getUPullInventory = async (year: number, make: string, model: string, partId: number) => {
  // Launch browser and open a new page
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://upullrparts.com/inventory/');

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  await page.click('#searchPartButton');
  process.stdout.write('Selecting Vehicle')
  await page.waitForNetworkIdle()
  await page.select('#years', year.toString())

  process.stdout.write('.')
  await page.waitForNetworkIdle()
  await page.select('#makes', make)

  process.stdout.write('.')
  await page.waitForNetworkIdle()
  await page.select('#models', model.toUpperCase())

  process.stdout.write('.')
  await page.waitForNetworkIdle()
  await page.select('#parts', partId.toString())

  process.stdout.write('.\n')
  await page.click('#icSubmit')
  process.stdout.write('Submitting Form...\n')

  await page.waitForNetworkIdle()
  await page.click('#fitmentOptions > button')

  await page.waitForNetworkIdle()
  await page.click('#fitmentDisclaimerOK')
  process.stdout.write('Waiting for vehicle results...\n')

  // U-Pull has two locations, which is why there are two vehicle tables
  const rows = await page.$$eval('#vehicletable1 > tbody > tr, #vehicletable2 > tbody > tr', rows => {
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, column => column.innerText);
    });
  })

  // cleanup
  await browser.close()

  return rows
};

// I need a new tailgate, lets see whats available
const results = await getUPullInventory(2009, 'Honda', 'Pilot', BACK_GLASS)
console.log(results)
