const FileUtilities = require("./FileUtilities");

const generateImpactReport = data => {
  const defects = {};
  const failed = data.filter(item => item.status === "failed");
  data.map(item => {
    item.defects.forEach(defect => {
      if (defects[defect] === undefined) {
        defects[defect] = 1;
      } else {
        defects[defect] = defects[defect] + 1;
      }
    });
  });
  return Object.keys(defects).map(defect => [defect, defects[defect]]);
};

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

  const defects = generateImpactReport(output);
  const sortedDefects = defects.sort((a, b) => b[1] - a[1]);

  const appScript = `
  function writeToSheet() {
    const input = ${JSON.stringify(output)};
    const defects = ${JSON.stringify(sortedDefects)};

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet1 = ss.getSheetByName('Raw data')
    const sheet2 = ss.getSheetByName('Impact study');

    for (let i = 0; i < input.length; i++) {
      const keys = ['jiraTag','name','status'];
      const row = input[i];
      for (let j = 1; j <= keys.length; j++) {
        sheet1.getRange(i+2, j).setValue(row[keys[j-1]]);
      }
      const defects = row['defects'].join(', ');
      sheet1.getRange(i+2, 4).setValue(defects);
    }
    
    for (let i = 0; i < defects.length; i++) {
      const row = defects[i];
      sheet2.getRange(i+2, 1).setValue(row[0]);
      sheet2.getRange(i+2, 2).setValue(row[1]);
    }
  }
  `;

  message = await FileUtilities.writeToAppScript(appScript);
  console.log(message);
};

main()
  .then()
  .catch();
