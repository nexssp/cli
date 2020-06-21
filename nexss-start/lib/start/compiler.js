const { getLangByFilename } = require("../../../nexss-language/lib/language");
const path = require("path");
// We get compiler
// if it is in the globalConfig ./nexss/config.json
//
const fs = require("fs");
const { info, warn } = require("../../../lib/log");
const cliArgs = require("minimist")(process.argv.slice(2));

module.exports.getCompiler = (file) => {
  const fileName = file.name;
  const fileFillPAth = path.join(file.path, file.name);
  const languageDefinition = getLangByFilename(fileName);

  const extension = path.extname(fileName).slice(1);
  let compiler;

  ld_compiler = languageDefinition.compilers;

  // We check for custom compiler at the top of the file

  if (path.extname(fileName) && fs.existsSync(fileName)) {
    if (cliArgs.verbose) {
      info(
        `Checking for the config in the program (eg. nexss-compiler:).. (top part of the file:${fileName})`
      );
    }

    // TODO: Later fix for efficient, read only lines which are needed
    // The one which starts with nexss-
    const fileContent = fs.readFileSync(fileName).toString().split(/\r?\n/);
    const maxConfigLines = 20; // fileContent.length
    for (let i = 0; i < maxConfigLines; i++) {
      const line = fileContent[i];
      if (!line.includes("nexss-") || !line.includes(":")) break;
      const splitter = line.split("nexss-")[1].split(":");
      file[splitter[0]] = splitter[1].trim();
    }
  }

  if (file.compiler && !ld_compiler[file.compiler]) {
    if (cliArgs.verbose) {
      warn(
        `Compiler has been set to ${file.compiler} from file but not exists. Using default one.`
      );
    }
    delete file.compiler;
  }
  if (!file.compiler) {
    // GLOBAL COMPILER
    let globalLangConfig;
    const globalConfigPath = require("os").homedir() + "/.nexss/config.json";
    if (require("fs").existsSync(globalConfigPath)) {
      globalConfig = require(globalConfigPath);
    } else {
      globalConfig = { languages: {} };
    }

    if (
      globalConfig &&
      globalConfig.languages &&
      globalConfig.languages[path.extname(fileName).slice(1)]
    ) {
      globalLangConfig =
        globalConfig.languages[path.extname(fileName).slice(1)];

      if (ld_compiler[globalLangConfig.compilers]) {
        compiler = languageDefinition.compilers[globalLangConfig.compilers];
        // console.log(compiler);
        if (cliArgs.verbose) {
          info(
            `Compiler has been set to ${compiler} from global config file ${globalConfigPath}`
          );
        }
      }
    }
    if (process.nexssGlobalConfig) {
      if (process.nexssGlobalConfig.languages[extension]) {
        globalLangConfig = process.nexssGlobalConfig.languages[extension];

        if (ld_compiler[globalLangConfig.compilers]) {
          compiler = languageDefinition.compilers[globalLangConfig.compilers];
          // console.log(compiler);
          if (cliArgs.verbose) {
            info(
              `Compiler has been set to ${compiler} from global config file ${globalConfigPath}`
            );
          }
        }
      }
    }
  }
  // CUSTOM COMPILER in the _nexss.yml file
  if (file.compiler) {
    fileCompilerSplit = file.compiler.split(" ");

    if (ld_compiler[fileCompilerSplit[0]]) {
      compiler = ld_compiler[fileCompilerSplit[0]];

      fileCompilerSplit.shift();
      compiler.args = fileCompilerSplit.concat(compiler.args).join(" ");
    }
  } else {
    if (!compiler) {
      if (languageDefinition) {
        compiler =
          languageDefinition.compilers[
            Object.keys(languageDefinition.compilers)[0]
          ];
      } else {
        compiler = {};
        compiler.command = "nexss";

        compiler.args = `${fileName} ${file.args.join(" ")}`;
      }
    }
  }

  return compiler;
};

// let compilerArgs;

// nexssResult.push({
//   stream: "transformNexss",
//   cmd: exeFile,
//   args: fileArgs.args
//     ? fileArgs.args
//         .replace(/<file>/g, fileName)
//         //.replace(/<destinationPath>/g, dirname(exeFile))
//         .replace(/<destinationFile>/g, exeFile)
//         .replace(/<destinationDirectory>/g, path.dirname(exeFile))
//         .split(" ")
//     : [],
//   fileName
// });
