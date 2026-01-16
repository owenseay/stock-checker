const config = require('./config');
const { checkStock } = require('./scraper');
const { sendStockReport } = require('./notifier');

async function main() {
    console.log('--- Starting Stock Check ---');
    console.log(new Date().toLocaleString());

    try {
        const results = await checkStock(config.stores, config.productUrl);

        // Log results to console
        console.table(results.map(r => ({
            Store: r.storeName,
            Stock: r.stockText,
            Price: r.price
        })));

        // Send email
        await sendStockReport(results);

    } catch (error) {
        console.error('Fatal execution error:', error);
    }

    console.log('--- Check Complete ---');
}

// Check for --cron flag to just run once (though logic is same for now)
if (require.main === module) {
    main();
}

module.exports = { main };
