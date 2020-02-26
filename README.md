# Allure to Sheets

1. Copy-Paste the `test-cases` directory from your allure build `test-cases`.
2. Run `npm start` to generate `output.json` and modify `Code.js`
3. Run `clasp push` to push generated `Code.js` to AppScript editor (you need to have clasp installed: `https://codelabs.developers.google.com/codelabs/clasp/#1`)
4. Go to `https://script.google.com/d/1-IgjidvQrB0CiNy1OqMSOT35MQ9iw-rWqahGVQpOn4um5fTG5UJHlrLR/edit?usp=sharing` and
   click the `Run` button (Grant permissions for the script to run)
   [Note: when you first open the script, it hangs for a bit]

### Assumptions Made

- Only one @JIRA-Key per test case
