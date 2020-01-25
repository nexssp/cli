const { warn, info } = require("../../lib/log");
const { bold, green } = require("../../lib/color");
const { existsSync, writeFileSync } = require("fs");
const path = require("path");
const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const {
  NEXSS_PROJECT_CONFIG_PATH,
  NEXSS_PROJECTS_DB
} = require("../../config/config");

if (process.argv.length > 4) {
  warn(`Project can be attached only from current folder.
Go to the folder of the project you want to attach and then 
'nexss project attach'`);
  process.exit(0);
}

info(`Attaching project from current folder ${bold(process.cwd())}`);

let configContent,
  questions = [];

const { loadConfigContent, saveConfigContent } = require("../../lib/config");

if (NEXSS_PROJECT_CONFIG_PATH) {
  info(`This is ${bold("Nexss PROGRAMMER")} project.`);
  configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
}

if (configContent && configContent.name) {
  info(`Project name: ${green(configContent.name)}`);
} else {
  questions.push({
    type: "input",
    name: "projectName",
    message: "Enter project name",
    default: path.basename(process.cwd())
  });
}

questions.push({
  type: "input",
  name: "description",
  message: "Enter description"
});

questions.push({
  type: "input",
  name: "repo",
  message: "Enter repository"
});

questions.push({
  type: "input",
  name: "editor",
  message: "Enter code editor command",
  default: "code ."
});

questions.push({
  type: "input",
  name: "note",
  message: "Enter extra note"
});

inquirer.prompt(questions).then(function(answers) {
  let projectNameIndex = answers.projectName || configContent.name;

  let projects = existsSync(NEXSS_PROJECTS_DB)
    ? require(NEXSS_PROJECTS_DB)
    : {};
  if (projects[projectNameIndex]) {
    warn(
      `project ${bold(projectNameIndex)} already exists in ${bold(
        NEXSS_PROJECTS_DB
      )}`
    );
    process.exit(1);
  }
  delete answers.projectName;

  answers.workDir = process.cwd();
  Object.assign(projects, { [projectNameIndex]: answers });

  writeFileSync(NEXSS_PROJECTS_DB, JSON.stringify(projects, null, 2));
});
