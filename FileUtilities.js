const fs = require("fs");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const fileWriteSuccess = "File write was successful";
const fileWriteFailure = "File write was unsuccessful";

class FileUtilities {
  static async getAllTestCases() {
    let files;
    try {
      files = await readdir("./test-cases");
      return Promise.all(
        files.map(async file => {
          return readFile(`./test-cases/${file}`);
        })
      );
    } catch (e) {
      console.log("Error getting all test cases", e);
    }
  }

  static async writeToOutputFile(content) {
    try {
      await writeFile("./output.json", JSON.stringify(content));
      return fileWriteSuccess;
    } catch (e) {
      return `${fileWriteFailure}, ${e}`;
    }
  }

  static async writeToAppScript(content) {
    try {
      await writeFile("./Code.js", content);
      return fileWriteSuccess;
    } catch (e) {
      return `${fileWriteFailure}, ${e}`;
    }
  }
}

module.exports = FileUtilities;
