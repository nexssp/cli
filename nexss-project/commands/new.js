const { warn, info, error, success } = require("../../lib/log");
const cliArgs = require("minimist")(process.argv.slice(3));
const fs = require("fs");
const path = require("path");
const { yellow, bold } = require("../../lib/color");
const copydir = require("copy-dir");
const currentPath = process.cwd();

let paramName = process.argv[4];

if (!paramName) {
  warn(`Enter project name eg. nexss project new project-name-here.`);
  process.exit(0);
}
let projectPath, dotDir;
if (paramName === ".") {
  dotDir = true;
  //We take make project path foldername as current dir
  paramName = path.basename(currentPath);
  projectPath = currentPath;

  if (fs.existsSync(`${projectPath}/_nexss.yml`)) {
    console.log("This is nexss project.");
    process.exit(1);
  }
} else {
  projectPath = path.join(currentPath, paramName);
  info(`Creating project '${paramName}'`);
  if (!fs.existsSync(projectPath)) {
    console.log(`creating project ${projectPath}`);
    fs.mkdirSync(projectPath, 0777);
  } else {
    if (!cliArgs.f && !cliArgs.ff) {
      error(`Folder ${projectPath} exists. Folder cannot exist.`);
      process.exit(1);
    } else {
      error(
        `Folder ${projectPath} exists but ${yellow("force option enabled.")}`
      );
    }
  }
}

let nexss = {};
nexss.template = cliArgs.template ? cliArgs.template : "default";
nexss.fullforce = cliArgs.ff;

if (nexss.template) {
  const templatePath = path.join(__dirname, "../templates/", nexss.template);

  // console.log(templatePath);

  if (!fs.existsSync(templatePath)) {
    error(`Template ${bold(nexss.template)} does not exist.`);

    fs.rmdirSync(projectPath);
    process.exit(1);
  } else {
    success(`Using ${bold(nexss.template)} template. Copying files...`);

    options = {};

    options.cover = false;
    if (!fs.existsSync(`${projectPath}/_nexss.yml`)) {
      copydir.sync(templatePath, projectPath, options);
    } else {
      console.log("This is already nexss project.");
    }
  }

  const { loadConfigContent, saveConfigContent } = require("../../lib/config");
  const newProjectConfigPath = path.join(projectPath, "_nexss.yml");
  let configContent = loadConfigContent(newProjectConfigPath);
  configContent.name = paramName;

  // console.log(configContent);

  saveConfigContent(configContent, newProjectConfigPath);

  if (dotDir) {
    //current folder new project
    success(
      `Project '${paramName}' is ready. 
to run please enter 'nexss start'`
    );
  } else {
    success(
      `Project '${paramName}' is ready. 
Go to by 'cd ${paramName}' and run 'nexss start'`
    );
  }
}
