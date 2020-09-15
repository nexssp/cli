const { warn, info } = require("../../lib/log");
const { bold, green } = require("../../lib/ansi");
const { existsSync, writeFileSync } = require("fs");
const path = require("path");
const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);
const cliArgs = require("minimist")(process.argv.slice(3));
const {
  NEXSS_PROJECT_CONFIG_PATH,
  NEXSS_PROJECTS_DB,
} = require("../../config/config");

// if (process.argv.length > 4) {
//   warn(`Project can be attached only from current folder.
// Go to the folder of the project you want to attach and then
// 'nexss project attach'`);
//   process.exit(0);
// }

info(`Attaching project from current folder ${bold(process.cwd())}`);

let configContent,
  questions = [];

const { loadConfigContent, saveConfigContent } = require("../../lib/config");

if (NEXSS_PROJECT_CONFIG_PATH) {
  info(`This is ${bold("Nexss PROGRAMMER")} project.`);
  configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
}

let answersFromParams = {};

if (configContent && configContent.name) {
  info(`Project name: ${green(configContent.name)}`);
} else {
  if (cliArgs.projectName) {
    answersFromParams.projectName = cliArgs.projectName;
    info(`Project name: ${green(answersFromParams.projectName)}`);
  } else {
    questions.push({
      type: "input",
      name: "projectName",
      message: "Enter project name",
      default: path.basename(process.cwd()),
    });
  }
}
if (cliArgs.description) {
  answersFromParams.description = cliArgs.description;
  info(`Description: ${green(answersFromParams.description)}`);
} else {
  questions.push({
    type: "input",
    name: "description",
    message: "Enter description",
    default: cliArgs.description,
  });
}

if (cliArgs.keywords) {
  answersFromParams.keywords = cliArgs.keywords;
  info(`Keywords: ${green(answersFromParams.keywords)}`);
} else {
  questions.push({
    type: "input",
    name: "keywords",
    message: "Enter keywords (for searching)",
  });
}

if (cliArgs.repo) {
  answersFromParams.repo = cliArgs.repo;
  info(`Repo: ${green(answersFromParams.repo)}`);
} else {
  questions.push({
    type: "input",
    name: "repo",
    message: "Enter repository",
  });
}

if (cliArgs.editor) {
  answersFromParams.editor = cliArgs.editor;
  info(`Editor: ${green(answersFromParams.editor)}`);
} else {
  questions.push({
    type: "input",
    name: "editor",
    message: "Enter code editor command",
    default: "code .",
  });
}
if (cliArgs.note) {
  answersFromParams.note = cliArgs.note;
  info(`Note: ${green(answersFromParams.note)}`);
} else {
  questions.push({
    type: "input",
    name: "note",
    message: "Enter extra note",
  });
}

if (questions.length === 0) {
  attachProject(answersFromParams);
} else {
  inquirer.prompt(questions).then(function (answers) {
    answers = Object.assign(answers, answersFromParams);
    attachProject(answers);
  });
}

function attachProject(answers) {
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
    process.exit(0);
  }
  delete answers.projectName;

  answers.workDir = process.cwd();
  Object.assign(projects, { [projectNameIndex]: answers });

  writeFileSync(NEXSS_PROJECTS_DB, JSON.stringify(projects, null, 2));
}
