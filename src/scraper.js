const { chromium } = require('playwright');

async function checkStock(stores, productUrl) {
    const results = [];
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    console.log(`Starting stock check for ${stores.length} stores...`);

    for (const store of stores) {
        try {
            const urlWithStore = `${productUrl}?storeid=${store.id}`;
            // console.log(`Checking ${store.name} (${store.id})...`);

            await page.goto(urlWithStore, { waitUntil: 'domcontentloaded' });

            // Wait a bit for any dynamic content if necessary, though DomContentLoaded is usually enough for Microcenter
            // We can also wait for the specific selector
            try {
                await page.waitForSelector('#pricing', { timeout: 5000 });
            } catch (e) {
                console.log(`Timeout waiting for price at ${store.name}`);
            }

            const data = await page.evaluate(() => {
                const priceEl = document.querySelector('#pricing');
                const stockEl = document.querySelector('.inventoryCnt');

                return {
                    price: priceEl ? priceEl.innerText.trim() : 'N/A',
                    stockRaw: stockEl ? stockEl.innerText.trim() : 'Unknown',
                    // Try to parse number from "10 IN STOCK"
                    stockSafe: stockEl ? stockEl.innerText.replace(/\D/g, '') : '0'
                };
            });

            const stockCount = parseInt(data.stockRaw.match(/\d+/)?.[0] || '0', 10);
            const inStock = data.stockRaw.toUpperCase().includes('IN STOCK') && stockCount > 0;

            // console.log(`  -> Result: ${data.stockRaw} (${data.price})`);

            results.push({
                storeName: store.name,
                storeId: store.id,
                price: data.price,
                stockText: data.stockRaw,
                available: inStock,
                count: stockCount
            });

        } catch (error) {
            console.error(`Error checking ${store.name}:`, error.message);
            results.push({
                storeName: store.name,
                storeId: store.id,
                error: error.message,
                available: false
            });
        }
    }

    await browser.close();
    return results;
}

module.exports = { checkStock };
