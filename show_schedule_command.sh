#!/bin/bash
PWD=$(pwd)
NODE_PATH=$(which node)

echo "To schedule this to run every day at 9:00 AM, add the following line to your crontab:"
echo ""
echo "0 9 * * * cd $PWD && npm start >> $PWD/cron.log 2>&1"
echo ""
echo "Run 'crontab -e' to edit your crontab, then paste the line above."
