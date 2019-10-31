const { extname, join } = require("path");
const cliArgs = require("minimist")(process.argv.slice(3));
const { searchData } = require("../../lib/search");

const inquirer = require("inquirer");
const { yellow, bold, green } = require("../../lib/color");
const { error, warn, ok, success, info } = require("../../lib/log");
const {
  NEXSS_PROJECT_SRC_PATH,
  NEXSS_PROJECT_CONFIG_PATH,
  NEXSS_PROJECT_PATH
} = require("../../config/config");
const fs = require("fs");
const { loadConfigContent, saveConfigContent } = require("../../lib/config");

// if (!NEXSS_PROJECT_SRC_PATH) {
//   console.log(`You are not in the nexss project folder.`);
//   process.exit(1);
// }

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

let options = {};

const cmd = cliArgs._[0];
options.fileName = cliArgs._[1] || options.fileName || "";
options.extension = extname(options.fileName);
options.template = cliArgs.template;

let questions = [];
if (!options.fileName) {
  questions.push({
    type: "input",
    name: "fileName",
    message: "Enter filename name",
    //default: fileName,
    validate: function(val) {
      return val ? true : "Type the new filename";
    }
  });
}

if (!options.extension) {
  const { languageNames } = require("../../nexss-language/lib/language");
  questions.push({
    type: "autocomplete",
    name: "extension",
    source: searchData(languageNames),
    message: "Select language",
    validate: function(val) {
      return val ? true : "Select file type";
    }
  });
}

if (!options.template) {
  const { templateNames } = require("../../nexss-template/lib/template");
  questions.push({
    type: "autocomplete",
    name: "template",
    source: searchData(templateNames, "extension", options.extension),
    message: "Select template",
    validate: function(val) {
      return val ? true : "Select file template";
    }
  });
}

if (!fs.existsSync(options.fileName) && !cliArgs.force) {
  inquirer.prompt(questions).then(function(answers) {
    Object.assign(options, answers);

    if (answers.extension) {
      // We remove formatting from the results
      answers.extension = answers.extension.split("\u001b[22m");
      options.extension = answers.extension[0].replace("\u001b[1m", "");
    }

    if (answers.template) {
      answers.template = answers.template.split("(");
      options.template = answers.template[1].split(")")[0];
    }

    execute(options);
    process.exit(0);
  });
} else {
  // we check if there is no flag
  if (!cliArgs.noconfig) {
    let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
    if (configContent) {
      if (
        configContentconfigContent.findByProp("files", "name", options.fileName)
      ) {
        info(yellow(`File '${options.fileName}' is already in the _nexss.yml`));
        return;
      } else {
        configContent.push("files", { name: options.fileName });
        saveConfigContent(configContent, NEXSS_PROJECT_CONFIG_PATH);
        success("Done.");
      }
    } else {
      console.log("file already exists.");
    }
  }
}

const execute = options => {
  const currentPath = process.cwd();
  if (!extname(options.fileName)) {
    options.fileName += options.extension;
  }

  // We can deal with files without nexss project!
  let filePath = options.fileName;

  if (
    NEXSS_PROJECT_SRC_PATH &&
    !options.fileName.includes("src/") &&
    !options.fileName.includes("src\\")
  ) {
    if (!fs.existsSync(filePath)) {
      filePath = join(NEXSS_PROJECT_SRC_PATH, options.fileName);
    }
  }

  if (!cliArgs.noconfig && fs.existsSync(filePath)) {
    if (!cliArgs.force) {
      // We store path related to the
      const filePath = NEXSS_PROJECT_SRC_PATH.replace(NEXSS_PROJECT_PATH, "");

      let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
      configContent.push("files", { name: filePath });
      saveConfigContent(configContent, NEXSS_PROJECT_CONFIG_PATH);
      success("File exists, edded to the _nexss.yml");
    } else {
      error(`File ${filePath} exists but ${yellow("force option enabled.")}`);
    }
  }

  if (
    (typeof options.template === "boolean" && options.template) ||
    !options.template
  ) {
    options.template = `default${options.extension}`;
  }

  if (options.template) {
    const templatePath = options.template;
    //console.log(templatePath);
    //  console.log(templatePath);
    if (!fs.existsSync(templatePath)) {
      info(yellow(`Template ${bold(options.template)} does not exist.`));
      info(yellow(`File '${options.fileName}' has not been created.`));
    } else {
      // console.log(
      //   green(
      //     `Using ${bold(options.template)} template. Creating from template...`
      //   )
      // );

      // console.log("COPY " + templatePath + " TO " + filePath);

      fs.copyFileSync(templatePath, filePath, err => {
        if (err) throw err;
      });

      ok(`File '${options.fileName}' has been created.`);

      // cliArgs.noconfig - no config modification
      if (!cliArgs.noconfig && NEXSS_PROJECT_CONFIG_PATH) {
        let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

        if (
          !options.fileName.includes("src/") &&
          !options.fileName.includes("src\\")
        ) {
          options.fileName = "src/" + options.fileName;
        }

        if (configContent.findByProp("files", "name", options.fileName)) {
          info(
            yellow(`File '${options.fileName}' is already in the _nexss.yml`)
          );
          return;
        } else {
          configContent.push("files", { name: options.fileName });
          saveConfigContent(configContent, NEXSS_PROJECT_CONFIG_PATH);
          success("Done.");
        }
      }
    }
    // Extra operation for the template like installations, files copy, info
    if (fs.existsSync(`${templatePath}.js`)) {
      console.log("Additional files and commands for this file. Please wait..");
      const extraOptions = require(`${templatePath}.js`);
      const files = extraOptions.files || [];
      const path = require("path");
      files.forEach(element => {
        const elementPath = path.join(path.dirname(templatePath), element);
        const destinationPath = NEXSS_PROJECT_SRC_PATH
          ? path.join(NEXSS_PROJECT_SRC_PATH, path.dirname(element))
          : path.dirname(element);

        //If we are in the project folder make a copy to the src/ of that project
        info(
          yellow(
            bold(
              `Copying 3rdParty libraries... 
${elementPath} TO 
${
  NEXSS_PROJECT_SRC_PATH ? path.join(NEXSS_PROJECT_SRC_PATH, element) : element
}`
            )
          )
        );
        const fse = require("fs-extra");
        fse.ensureDirSync(destinationPath);
        fse.copySync(
          elementPath,
          path.join(destinationPath, path.basename(element))
        );
        success("copied.");
      });

      const descriptions = extraOptions.descriptions || [];
      if (descriptions.length > 0) {
        warn("Some information about installed packages.");
        descriptions.forEach(desc => {
          warn(desc);
        });
      }
      let commands = extraOptions.commands;

      if (commands) {
        // FIXME: to check this part!!
        commands = commands[process.platform] || commands.all;
        if (commands)
          commands.forEach(cmd => {
            // TODO: better error handling
            // console.log(cmd);
            const cp = require("child_process").execSync(`${cmd}`, {
              stdio: "inherit"
            });
          });
      }
    } else {
      // info(`No extra operations file ${templatePath}.js found.`);
    }
  }
};
