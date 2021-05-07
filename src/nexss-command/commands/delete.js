const { searchData } = require("../../lib/search");
const { loadConfigContent, saveConfigContent } = require("../../lib/config");
const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);
const commands = (e) => {
  return configContent.commands.map((f) => f.name);
};

let questions = [];
questions.push({
  type: "autocomplete",
  name: "commandToDelete",
  source: searchData(commands),
  message: "Select command to delete. Be careful as there is no confirmation!",
});

inquirer.prompt(questions).then((answers) => {
  //console.log(answers);
  const { loadConfigContent, saveConfigContent } = require("../../lib/config");
  const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
  let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

  configContent.deleteByProp("commands", "name", answers.commandToDelete);
  saveConfigContent(configContent, NEXSS_PROJECT_CONFIG_PATH);
  log.success("Done..");
});
