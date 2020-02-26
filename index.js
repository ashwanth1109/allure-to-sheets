const FileUtilities = require("./FileUtilities");

const main = async () => {
  const bufferArray = await FileUtilities.getAllTestCases();

  const contentsArray = bufferArray.map(file => file.toString());
  const output = contentsArray.map(contents => {
    const contentsInJson = JSON.parse(contents);
    const { name, status, labels } = contentsInJson;
    const jiraTag = (
      labels.find(
        label => label.name === "tag" && label.value.match(/@JIRA-Key-/)
      ) || { value: "" }
    ).value;
    const defects = labels
      .filter(label => label.name === "tag" && label.value.match(/@Defect-/))
      .map(defect => defect.value);
    return { jiraTag, name, status, defects };
  });

  let message = await FileUtilities.writeToOutputFile(output);
  console.log(message);

  const appScript = `
  function writeToSheet() {
    const input = ${JSON.stringify(output)};

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet1 = ss.getSheetByName('Raw data')

    for (let i = 0; i < input.length; i++) {
      const keys = ['jiraTag','name','status'];
      const row = input[i];
      for (let j = 1; j <= keys.length; j++) {
        sheet1.getRange(i+2, j).setValue(row[keys[j-1]]);
      }
      const defects = row['defects'].join(', ');
      sheet1.getRange(i+2, 4).setValue(defects);
    }
  }
  `;

  message = await FileUtilities.writeToAppScript(appScript);
  console.log(message);
};

main()
  .then()
  .catch();
