const { loadConfigContent } = require("../../lib/config");
const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
const { searchData } = require("../../lib/search");
const { deleteFile } = require("../lib/file");
const { existsSync } = require("fs");
const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);
// if (cliArgs._.length === 0) {
//   log.error("Please specify file to delete from project");
//   const files = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH).files;
//   if (files && files.length > 0) {
//     files.forEach(element => {
//       console.log(`${element.name}`);
//     });
//   } else {
//     warn("There is no files to delete");
//   }
//   return;
// }
let options = {};
options.fileName = cliArgs._[2];
let nexssConfig = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
if (!nexssConfig) {
  log.warn(
    `You are not in the Nexss Programmer Project. To remove file plase use 'rm ${options.fileName}'`
  );
  process.exit();
}
if (
  options.fileName &&
  nexssConfig.findByProp("files", "name", options.fileName)
) {
  log.info(`File '${options.fileName}' is in the _nexss.yml.`);

  deleteFile(options.fileName);
  // process.exit(0);
} else {
  const projectFiles = () => {
    return nexssConfig.files.map((f) => f.name);
  };
  console.log(projectFiles());
  let questions = [];
  questions.push({
    type: "autocomplete",
    name: "fileToDelete",
    source: searchData(projectFiles),
    message: "Select file to delete",
  });

  inquirer.prompt(questions).then((answers) => {
    //console.log(answers);
    //const nexssConfig = require("./lib/nexss-config");
    if (!answers.fileToDelete) {
      log.warn("No file has been selected to delete.");
      return;
    }
    deleteFile(answers.fileToDelete);
  });
  if (options.fileName)
    log.warn(`File '${options.fileName}' is NOT in the _nexss.yml file`);
  process.exit(0);
}
