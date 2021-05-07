const fs = require("fs");
const path = require("path");
const copydir = require("copy-dir");
const currentPath = process.cwd();

let paramName = cliArgs._[2];

if (!paramName) {
  log.warn(`Enter project name eg. nexss project new project-name-here.`);
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
    process.exit(0);
  }
} else {
  projectPath = path.join(currentPath, paramName);
  log.info(`Creating project '${paramName}'`);
  if (!fs.existsSync(projectPath)) {
    console.log(`creating project ${projectPath}`);
    fs.mkdirSync(projectPath, 0777);
  } else {
    if (!cliArgs.f && !cliArgs.ff) {
      log.error(`Folder ${projectPath} exists. Folder cannot exist.`);
      process.exit(0);
    } else {
      log.error(
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
  if (!fs.existsSync(templatePath)) {
    log.error(`Template ${bold(nexss.template)} does not exist.`);
    fs.rmdirSync(projectPath);
    process.exit(0);
  } else {
    log.success(`Using ${bold(nexss.template)} template. Copying files...`);

    options = {};
    options.cover = false;
    if (!fs.existsSync(`${projectPath}/_nexss.yml`)) {
      // We check if there is default template already (first run?)
      if (!fs.existsSync(`${templatePath}/_nexss.yml`)) {
        //We clone the default template
        try {
          require("child_process").execSync(
            `git clone https://github.com/nexssp/template_default.git ${templatePath}`,
            {
              stdio: "inherit",
            }
          );
          log.success(`Default template cloned.`);
        } catch (er) {
          console.error(er);
          process.exit(0);
        }
      }
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
    log.success(
      `Project '${paramName}' is ready. 
to run please enter 'nexss start'`
    );
  } else {
    log.success(
      `Project '${paramName}' is ready. 
Go to the project by command '${bold("cd " + paramName)}'`
    );
  }
}
