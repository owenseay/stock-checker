const config = require('./src/config');
const { checkStock } = require('./src/scraper');

(async () => {
    console.log('Running test scraper...');
    // Extract just one store for testing (e.g., Phoenix)
    const testStore = config.stores.find(s => s.name === 'Phoenix') || config.stores[0];

    console.log(`Testing against store: ${testStore.name}`);

    const results = await checkStock([testStore], config.productUrl);

    console.log('Results:', JSON.stringify(results, null, 2));
})();
