const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendStockReport(results) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Skipping email: EMAIL_USER or EMAIL_PASS not set in .env');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Easy default, but can be configured
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const availableItems = results.filter(r => r.available);

    // Construct email body
    let html = '<h2>Microcenter Mac Mini Stock Report</h2>';

    if (availableItems.length === 0) {
        html += '<p>No stock found at checked locations.</p>';
    } else {
        html += '<p style="color: green; font-weight: bold;">Found stock at the following locations:</p>';
        html += '<table border="1" cellpadding="5" cellspacing="0">';
        html += '<tr><th>Store</th><th>Stock</th><th>Price</th></tr>';
        availableItems.forEach(item => {
            html += `<tr>
        <td>${item.storeName}</td>
        <td>${item.stockText}</td>
        <td>${item.price}</td>
      </tr>`;
        });
        html += '</table>';
    }

    html += '<h3>Full Report</h3><ul>';
    results.forEach(item => {
        const color = item.available ? 'green' : 'red';
        let stockStatus = item.stockText;

        // Polish the output: Treat "Unknown" or empty as "Out of Stock"
        if (stockStatus === 'Unknown' || !stockStatus) {
            stockStatus = 'Out of Stock';
        }

        html += `<li style="color: ${color}">${item.storeName}: ${stockStatus}</li>`;
    });
    html += '</ul>';

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER, // Send to self by default
        subject: `Mac Mini Stock Alert: ${availableItems.length} Stores Available`,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { sendStockReport };
