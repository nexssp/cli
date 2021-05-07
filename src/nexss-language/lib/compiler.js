const { getLangByFilename } = require("./language");

module.exports.getCompiler = (file) => {
  const fileName = file.name;
  const fileFillPAth = path.join(file.path, file.name);
  log.dc(`➤ Setup language for: ${bold(fileName)}`);
  const languageDefinition = getLangByFilename(fileName);
  if (!languageDefinition) {
    // THere can be also configuration isssues
    log.error(
      bold(
        yellow(
          `If you see any errors before this statement, please fix them first.`
        )
      )
    );
    // TODO: ?? Execute shell commands? return false and pass shell commands?
    // We check if we can run this.
    // maybe later here to execute just shell comands......

    // try {
    //   console.log(process.argv, file);
    //   const res = require("child_process").execSync("dir").toString();
    //   console.log(res);
    // } catch (e) {
    //   console.log(e);
    // }
    log.error("There might be an issue", file);
    log.error(
      "Maybe there is a program with the same name as command of Nexss Programmer?"
    );
    log.error(
      "Eg. You execute `nexss " +
        cliArgs._[0] +
        " install` and you are in the folder with the `" +
        cliArgs._[0] +
        "` program."
    );
    process.exit(1);
  }

  const extension = path.extname(fileName).slice(1);
  let compiler;

  ld_compiler = languageDefinition.compilers;

  // We check for custom compiler at the top of the file

  if (path.extname(fileName) && fs.existsSync(fileName)) {
    if (cliArgs.verbose) {
      log.info(
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

  if (
    file.compiler &&
    !ld_compiler[file && file.compiler && file.compiler.split(" ")[0]]
  ) {
    if (cliArgs.verbose) {
      log.warn(
        `Compiler has been set to ${file.compiler} from file but not exists. Using default one.`
      );
    }
    delete file.compiler;
  }

  if (!file.compiler) {
    // GLOBAL COMPILER
    let globalLangConfig;
    const globalConfigPath = require("os").homedir() + "/.nexss/config.json";
    if (fs.existsSync(globalConfigPath)) {
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
          log.info(
            `Compiler has been set to ${compiler} from global config file ${globalConfigPath}`
          );
        }
      }
    }
    if (process.nexssGlobalConfig) {
      if (
        process.nexssGlobalConfig.languages &&
        process.nexssGlobalConfig.languages[extension]
      ) {
        globalLangConfig = process.nexssGlobalConfig.languages[extension];

        if (ld_compiler[globalLangConfig.compilers]) {
          compiler = languageDefinition.compilers[globalLangConfig.compilers];
          // console.log(compiler);
          if (cliArgs.verbose) {
            log.info(
              `Compiler has been set to ${compiler} from global config file ${globalConfigPath}`
            );
          }
        }
      }
    }
  }
  // CUSTOM COMPILER in the _nexss.yml file

  if (
    cliArgs.nxsCompiler &&
    (compiler = ld_compiler[cliArgs.nxsCompiler.split(" ")[0]])
  ) {
    // console.log(compiler);
    if (cliArgs.verbose) {
      log.info(
        `Compiler has been set to ${
          cliArgs.nxsCompiler.split(" ")[0]
        } from command line arguments.`
      );
    }
  } else {
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
  }

  return compiler;
};
