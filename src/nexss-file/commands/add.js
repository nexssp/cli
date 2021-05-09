const {
  extname,
  join,
  resolve,
  dirname,
  isAbsolute,
  normalize,
} = require("path");

// config.push
Object.defineProperty(Object.prototype, "push", {
  enumerable: false,
  value: function push(location, what) {
    if (!this[location]) {
      this[location] = [];
    }

    if (!Array.isArray(this[location])) {
      // if this is not array convert to array to add new value
      this[location] = [this[location]];
    }

    this[location].push(what);
  },
});

const cliArgs = require("minimist")(process.argv.slice(3));
const { searchData } = require("../../lib/search");
const {
  NEXSS_PROJECT_SRC_PATH,
  NEXSS_PROJECT_CONFIG_PATH,
} = require("../../config/config");
const fs = require("fs");
const { loadConfigContent, saveConfigContent } = require("../../lib/config");
const nexssLanguages = require("../../nexss-language/lib/language");
const { extraFunctions } = require("../lib/fileExtraOptions");

var options = {};
options.fileName = cliArgs._[1] || options.fileName || "";

if (
  !/^[^\\\/\:\*\?\"\<\>\|\.]+(\.[^\\\/\:\*\?\"\<\>\|\.]+)+$/.test(
    options.fileName
  )
) {
  log.error(`Add valid filename like: mycorrectfilename.[extension]. Examples:
nexss file add myfile.js
nexss f a myfile.rs`);
  process.exit(0);
}

options.filePath = options.fileName;

if (
  NEXSS_PROJECT_SRC_PATH &&
  !options.fileName.includes("src/") &&
  !options.fileName.includes("src\\")
) {
  if (!fs.existsSync(options.fileName)) {
    options.filePath = join(NEXSS_PROJECT_SRC_PATH, options.fileName);
  }
}

if (fs.existsSync(options.filePath) && !cliArgs.force && !cliArgs.f) {
  log.error(`File already exists: ${options.fileName}`);
  process.exit(0);
}

options.extension = extname(options.fileName);
options.template = cliArgs.template || cliArgs.t;
var lang = nexssLanguages.getLang(options.extension);

let questions = [];

if (
  options.template ||
  cliArgs.helloWorld ||
  cliArgs.HelloWorld ||
  cliArgs.default ||
  cliArgs.empty
) {
  if (cliArgs.helloWorld) {
    options.template = "helloWorld";
  } else if (cliArgs.HelloWorld) {
    options.template = "HelloWorld";
  } else if (cliArgs.default) {
    options.template = "default";
  } else if (cliArgs.empty) {
    options.template = "!empty";
  } else if (cliArgs.e) {
    options.template = "!empty";
  }

  if (extname(options.template)) {
    if (!isAbsolute(options.template)) {
      log.error(`Please enter template name without extension or pass the absolute path. Example:
nexss file add myprogram.js --template=default
nexss file add myprogram.js --template=helloWorld
`);
      process.exit(0);
    } else {
      if (existsSync(options.template)) {
        log.error(`The template${options.template} does not exist.`);
        process.exit(0);
      }
    }
  }
  execute(options);
} else {
  const inquirer = require("inquirer");
  inquirer.registerPrompt(
    "autocomplete",
    require("inquirer-autocomplete-prompt")
  );

  const { templateNames } = require("../../nexss-language/lib/template");

  questions.push({
    type: "autocomplete",
    name: "template",
    source: searchData(templateNames, "extension", options.extension),
    message: "Select template",
    validate: function (val) {
      return val ? true : "Select file template";
    },
  });
  inquirer.prompt(questions).then(function (answers) {
    Object.assign(options, answers);
    // console.log(answers.template);
    if (answers.template) {
      answers.template = answers.template.split(" ")[1];
      options.template = answers.template;
    }

    execute(options);
    process.exit(0);
  });
}

function execute(options) {
  let filePath = options.filePath;

  if (
    (typeof options.template === "boolean" && options.template) ||
    !options.template
  ) {
    options.template = `default${options.extension}`;
  }

  if (options.template) {
    if (!isAbsolute(options.template) && !extname(options.template)) {
      options.template = `${options.template}${options.extension}`;
    }

    let templatesPath =
      require("../../nexss-language/lib/template").getTemplatesPaths(
        options.extension
      ) + `/${options.template}`;

    // options.templatePath = resolve(
    //   dirname(lang.configFile),
    //   "templates",
    //   options.template
    // );

    options.templatePath = templatesPath;

    if (!fs.existsSync(options.templatePath)) {
      log.error(`Template ${bold(options.template)} does not exist.`);
      log.error(
        `File ${bold(normalize(options.fileName))} has not been created.`
      );
      process.exit(0);
    } else {
      log.info(
        `Using ${bold(options.template)} template. Creating from template...`
      );

      const directory = dirname(filePath);
      if (!fs.existsSync(directory)) {
        log.info(
          `src/ folder not found. creating in the main folder. ${NEXSS_PROJECT_SRC_PATH}`
        );
      }

      try {
        fs.copyFileSync(options.templatePath, filePath);

        log.ok(`File ${yellow(bold(normalize(filePath)))} has been created.`);
      } catch (err) {
        if (err.code === "ENOENT") {
          log.error(
            `Error during copy from ${normalize(
              options.templatePath
            )} to ${filePath}`
          );
          return;
        } else if (err.code === "EACCES") {
          log.error(
            `Error during copy from ${normalize(
              options.templatePath
            )} to ${filePath}. Permission denied. You may need to run this as root? or change permissions?`
          );
          return;
        } else {
          throw err;
        }
      }

      // cliArgs.noconfig - no config modification
      if (!cliArgs.noconfig && NEXSS_PROJECT_CONFIG_PATH) {
        let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

        if (
          !options.fileName.includes("src/") &&
          !options.fileName.includes("src\\")
        ) {
          options.fileName = "src/" + options.fileName;
        }

        if (
          !cliArgs.f &&
          configContent.findByProp("files", "name", options.fileName)
        ) {
          log.info(
            yellow(
              `File '${normalize(
                options.fileName
              )}' is already in the _nexss.yml`
            )
          );
          return;
        } else {
          configContent.push("files", {
            name: options.fileName,
          });
          saveConfigContent(configContent, NEXSS_PROJECT_CONFIG_PATH);
          log.success("Done.");
        }
      }
    }

    extraFunctions(options.templatePath);
    if (cliArgs.edit) {
      const { edit } = require("../../nexss-edit/lib/edit");
      edit(options.fileName);
    }
  }
}
