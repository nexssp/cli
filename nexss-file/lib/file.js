const fs = require("fs");
const fse = require("fs-extra");

// const { bold, blue, yellow, green } = require("../../lib/ansi");
// const { success, ok, error } = require("../../lib/log");
const { addTimeStampToFilename } = require("../../lib/fs");

const { loadConfigContent, saveConfigContent } = require("../../lib/config");
const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
// const nexssConfig = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

function deleteFile(filename) {
  let questions = [];

  questions.push({
    type: "confirm",
    name: "delete",
    message:
      "Do you really want to delete file " +
      filename +
      "? Backup will be automatically done by adding timestamp at the end of file..",
  });

  inquirer.prompt(questions).then(function (answers) {
    if (answers.delete) {
      //const nexssConfig = require("./lib/nexss-config")();

      const {
        loadConfigContent,
        saveConfigContent,
      } = require("../../lib/config");

      let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

      configContent.deleteByProp("files", "name", filename);

      saveConfigContent(configContent, NEXSS_PROJECT_CONFIG_PATH);
      const fileStammped = addTimeStampToFilename(filename);
      if (fs.existsSync(filename)) {
        fs.renameSync(filename, fileStammped);
      }

      console.log(
        `File definition has been removed from _nexss.yml and file has been renamed to ${fileStammped}.`
      );
      return;
    }
  });
}

module.exports = { deleteFile };
