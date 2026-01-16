# Ionized Kepler - Mac Mini Stock Checker

A Node.js utility to track Mac Mini stock at Microcenter locations and send email alerts.

## 🚀 Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Email**
    Copy `.env.example` to `.env` and add your Gmail credentials (use an App Password).
    ```bash
    cp .env.example .env
    ```

3.  **Run Manually**
    ```bash
    npm start
    ```

## 📅 Scheduling (Daily Check)

To run this automatically every day, you can use `cron`. I've included a helper script to generate the exact command you need:

```bash
./show_schedule_command.sh
```

Run that script, then copy the output into your crontab (`crontab -e`).

## ⚙️ Configuration

Edit `src/config.js` to modify:
- **Stores**: The list of Microcenter locations to check.
- **Product**: The target URL to scrape.

## 🛠️ Troubleshooting

- **Playwright Errors**: If you see browser errors, run `npx playwright install chromium`.
- **Email Failures**: Ensure 2-Factor Auth is ON for your Google Account and you are using an **App Password**, not your main password.
