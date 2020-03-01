const PROCESS_CWD = process.cwd();
const path = require("path");
const { info, error, warn, di, dg, dy, dbg } = require("../../lib/log");
const dotenv = require("dotenv");
const { inspect } = require("util"),
  { yellow, bold, green } = require("../../lib/color"),
  { startServer } = require("../../lib/server"),
  { getLangByFilename } = require("../../nexss-language/lib/language");
const { is, Exists } = require("../../lib/data/guard");
const { ensureInstalled } = require("../../lib/terminal");
const fs = require("fs");
const { existsSync, lstatSync } = require("fs");
const { isURL } = require("../../lib/data/url");
const url = require("url");

// nexss s OR nexss start is ommiting
let paramNumber = 2;
if (process.argv[2] === "s" || process.argv[2] === "start") {
  paramNumber = 3;
}
const { NEXSS_PACKAGES_PATH } = require("../../config/config");
const cliArgs = require("minimist")(process.argv.slice(paramNumber));

const request = require("request");

let fileOrDirectory = Array.isArray(cliArgs._) && cliArgs._.shift();

// There is an argument so we check if this is folder
if (fileOrDirectory) {
  if (!isURL(fileOrDirectory)) {
    fileOrDirectory = fileOrDirectory.replace(/\\/g, "/");
    fileOrDirectory = path.normalize(fileOrDirectory).replace(/(\/|\\)$/, "");
  }

  //replace only first occurance
  const platformDir = `${fileOrDirectory}/${process.platform}`;
  const platformExists = existsSync(platformDir);

  // In the Package you can create folder eg win32, darwin OR linux.
  // We check if the platformDir
  if (platformExists && lstatSync(`${platformDir}`).isDirectory()) {
    process.chdir(platformDir);
    fileOrDirectory = null;
  } else if (
    existsSync(`${fileOrDirectory}`) &&
    lstatSync(`${fileOrDirectory}`).isDirectory()
  ) {
    process.chdir(fileOrDirectory);
    fileOrDirectory = null;
  } else {
    // We get config for the selected file
    const nexssConfig = require("../../lib/config").loadConfigContent();
    if (
      nexssConfig &&
      nexssConfig.findByProp("files", "name", fileOrDirectory)
    ) {
      fileOrDirectory = [
        nexssConfig.findByProp("files", "name", fileOrDirectory)
      ];
    } else {
      // console.log(fileOrDirectory);
      fileOrDirectory = [{ name: fileOrDirectory }];
    }
  }
}

//  ???????
const nexssConfig = require("../../lib/config").loadConfigContent();
const globalConfigPath = require("os").homedir() + "/.nexss/config.json";
if (require("fs").existsSync(globalConfigPath)) {
  globalConfig = require(globalConfigPath);
} else {
  globalConfig = { languages: {} };
}

let projectPath;
if (nexssConfig) {
  delete require.cache[require.resolve("../../config/config")];
  const { NEXSS_PROJECT_PATH } = require("../../config/config");

  projectPath = path.resolve(NEXSS_PROJECT_PATH);
  const envConfigPath = projectPath
    ? `${projectPath}/config.env`
    : `./config.env`;

  dotenv.config({ path: envConfigPath });
}

let files;

// SEQUENCES
// more: https://github.com/nexssp/cli/wiki/Sequences

if (cliArgs.seq) {
  if (!nexssConfig) {
    error(
      "You can use 'sequences' ONLY in the Nexss Programmer Project. Create new project in the current folder by 'nexss project new .'"
    );
    process.exit();
  }

  if (!nexssConfig.sequences) {
    error(
      `There is no 'sequence' section in the _nexss.yml file: ${nexssConfig.filePath}
more: https://github.com/nexssp/cli/wiki/Sequences`
    );
    process.exit();
  }

  if (!nexssConfig.sequences[cliArgs.seq]) {
    error(`${cliArgs.seq} sequence does not exist in the _nexss.yml`);
    process.exit();
  } else {
    files = nexssConfig.sequences[cliArgs.seq];
  }
}

if (!files) {
  if (
    nexssConfig &&
    nexssConfig.sequences &&
    nexssConfig.sequences["default"]
  ) {
    files = nexssConfig.sequences["default"];
  } else {
    files = fileOrDirectory || (nexssConfig && nexssConfig.files) || [];
  }
}

// SERVER
if (cliArgs.server) {
  if (nexssConfig) {
    startServer(nexssConfig.server, { cwd: PROCESS_CWD });
  } else {
    startServer({}, { cwd: PROCESS_CWD });
  }
} else {
  if (files.length === 0) {
    warn(
      "Nothing to run. To add files to the project please use 'nexss file add myfile.[language extension]'"
    );
    process.exit();
  }

  // more here: https://github.com/nexssp/cli/wiki/Config
  let startData = (nexssConfig && nexssConfig.data) || {};
  let dataStdin = {};
  let nexssResult = [];
  let nexssBuild = [];
  const globalDisabled = nexssConfig && nexssConfig.disabled;
  const { run } = require("../lib/pipe");
  let nexssInput = false;
  if (!nexssConfig || (nexssConfig && !nexssConfig.customInput)) {
    nexssInput = true;
    startData.start = +new Date();
    //var moment = require("moment");
    //var x = moment(startData.start).format("H:m:s");
    //console.log(moment().locale());
    //console.log(x);

    startData.cwd = PROCESS_CWD;

    // if (nexssConfig && nexssConfig.filePath) {
    //   startData.projwd = path.dirname(nexssConfig.filePath);
    // }
    startData.debug = nexssConfig && nexssConfig.debug;

    Object.assign(startData, cliArgs);

    // TEST DATA
    // if (cliArgs.test) {
    //   info("Testing enabled");
    //   let testDataPassed = cliArgs.testData || cliArgs.testdata;
    //   if (!testDataPassed) {
    //     testData = require("../../config/testingData.json");
    //   } else {
    //     var testDataPath = path.normalize(`${PROCESS_CWD}/${testDataPassed}`);
    //     try {
    //       testData = require(testDataPath);
    //     } catch (_) {
    //       if (!fs.existsSync(testDataPath)) {
    //         error(
    //           `Your test data ${bold(
    //             testDataPath
    //           )} must be valid json or JavaScript/NodeJS file!`
    //         );
    //       } else {
    //         error(
    //           `Your test data ${bold(
    //             testDataPath
    //           )} must be valid json or JavaScript/NodeJS file!`
    //         );
    //       }

    //       process.exit();
    //     }
    //   }
    //   info("Testing Input Data", JSON.stringify(testData, 2));

    //   Object.assign(startData, testData);
    // }

    // STDIN -trim just to avoid extra params from JSON
    // const stdinRead = require("../lib/stdin")().trim();

    // if (stdinRead) {
    //   try {
    //     dataStdin = JSON.parse(stdinRead);
    //   } catch (error) {
    //     dataStdin.nexssStdin = stdinRead;
    //   }

    //   Object.assign(startData, dataStdin);
    // }

    // if (cliArgs.debug) di(`startData: ${yellow(inspect(startData))}`);

    // const globalBuild = (nexssConfig && nexssConfig.build) || undefined;

    nexssBuild.push({ stream: "readable", cmd: startData });

    // nexssBuild.push(() => {
    //   var Readable = require("stream").Readable;
    //   var s = new Readable();
    //   s._read = () => {};
    //   s.push(JSON.stringify(startData));
    //   s.push(null);
    //   return s;
    // });

    if (cliArgs.debug) {
      nexssBuild.push({
        stream: "transformError",
        cmd: "Builder Started."
      });
    }

    // let nexssResult = [() => "process.stdin"];
    nexssResult.push({ stream: "readable", cmd: startData });

    // if (process.nexssConfigContent) {
    //   nexssResult.push({
    //     stream: "transformValidation",
    //     cmd: `input`
    //   });
    // }
  } else {
    // nexssResult.push(() => {
    //   var Readable = require("stream").Readable;
    //   var s = new Readable();
    //   s._read = () => {};
    //   s.push(nexssConfig.customInput);
    //   s.push(null);
    //   return s;
    // });
    nexssResult.push({ stream: "readable", cmd: nexssConfig.customInput });
  }
  // if (cliArgs.test) {
  //   nexssResult.push(() => {
  //     var Transform = require("stream").Transform;
  //     var s = new Transform();
  //     s._transform = function(obj, encoding, cb) {
  //       let c = JSON.parse(obj.toString());
  //       c.transformWorks = "ąęćśŻó";
  //       this.push(JSON.stringify(c));
  //       cb();
  //     };
  //     return s;
  //   });
  // }

  (async () => {
    for await (let file of files) {
      let compiler = null;
      if (projectPath) process.chdir(projectPath);

      dg(`Parsing ${file.name}..`);

      if (globalDisabled && file.disabled) {
        dy(`file ${file.name} is disabled or Global disabled. Going next..`);
        return;
      }

      if (!file.name) {
        error(
          "file needs to have `name` field in the `files` section of the _nexss.yml config file. Please see examples/packages to grasp the idea."
        );
        process.exit();
      }

      let fileArgs = file.name.split(" ");
      let fileName = fileArgs.shift();

      let stream = "transformNexss";
      const parsed = url.parse(fileName);

      switch (parsed.protocol) {
        case "http:":
        case "https:":
          stream = "transformRequest";
          nexssResult.push(() => request(fileName));
          break;
        default:
          if (parsed.protocol) {
            if (!path.isAbsolute(fileName)) {
              fileName = fileName.substring(parsed.protocol.length + 2);
              if (parsed.protocol === "file:") {
                stream = "transformFile";
              }
            }
          }

          if (await Exists(`${fileName}`)) {
            const oldFileName = fileName;
            fileName = `${fileName}`;
            // Below there is the same code - to modify later.
            if (fs.existsSync(fileName)) {
              if (!fs.lstatSync(fileName).isDirectory()) {
                fileName = oldFileName;
              } else {
                process.chdir(fileName);
              }
            }
          } else {
            if (!(await Exists(`${fileName}`))) {
              fileName = `src/${fileName}`;

              if (await Exists(`${fileName}`)) {
                const oldFileName = fileName;
                fileName = `${fileName}`;

                if (fs.existsSync(fileName)) {
                  if (!fs.lstatSync(fileName).isDirectory()) {
                    fileName = oldFileName;
                  } else {
                    process.chdir(fileName);
                  }
                }
              } else {
                if (cliArgs.verbose)
                  error(
                    `File ${fileName} has not been found. Trying Packages folder`
                  );

                if (fileName.substring(0, 3) === "src") {
                  fileName = fileName.substring(4);
                }

                fileName = `${NEXSS_PACKAGES_PATH}/${fileName}`;

                if (!(await Exists(fileName))) {
                  error(
                    `Nexss: ${path.normalize(fileName)} has not been found.`
                  );
                  info(
                    "Possible solution: remove file entry from files section in the nexss.yml file. Files part in the _nexss.yml:"
                  );
                  console.log(nexssConfig.files);
                  return 0;
                } else {
                  if (fs.lstatSync(fileName).isDirectory()) {
                    process.chdir(fileName);
                  } else {
                    process.chdir(path.dirname(fileName));
                  }
                }
              }
            }
          }

          // Extra info for also Error Handling
          process.nexssCWD = process.cwd();
          process.nexssFilename = path.normalize(fileName);

          let languageDefinition = getLangByFilename(fileName);
          ld_compiler = languageDefinition.compilers;

          // GLOBAL COMPILER
          let globalLangConfig;
          if (
            globalConfig &&
            globalConfig.languages &&
            globalConfig.languages[path.extname(fileName).slice(1)]
          ) {
            globalLangConfig =
              globalConfig.languages[path.extname(fileName).slice(1)];

            if (ld_compiler[globalLangConfig.compilers]) {
              compiler =
                languageDefinition.compilers[globalLangConfig.compilers];
              // console.log(compiler);
              if (cliArgs.verbose) {
                info(
                  `Compiler has been set to ${compiler} from global config file ${globalConfigPath}`
                );
              }
            }
          }
          let compilerArgs;
          // CUSTOM COMPILER in the _nexss.yml file
          if (file.compiler) {
            fileCompilerSplit = file.compiler.split(" ");

            if (ld_compiler[fileCompilerSplit[0]]) {
              compiler = ld_compiler[fileCompilerSplit[0]];

              fileCompilerSplit.shift();
              compilerArgs = fileCompilerSplit.concat(compilerArgs).join(" ");
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

                compilerArgs = `${fileName} ${fileArgs.join(" ")}`;
              }
            }
          }

          let builder;

          if (languageDefinition) {
            builder =
              languageDefinition.builders[
                Object.keys(languageDefinition.builders)[0]
              ];
          }

          // dg(`COMPILER IN`, compiler);
          let spawnOptions = { detached: true };
          let compilerAdded = false;

          if (!builder || (compiler && compiler.args && !cliArgs.build)) {
            // We make sure compiler is installed
            compilerAdded = true;
            if (compiler.command) {
              let compilerInstallOptions = {};

              if (compiler.shell) {
                compilerInstallOptions = { shell: "Powershell" };
              }

              ensureInstalled(
                compiler.command,
                compiler.install,
                compilerInstallOptions
              );

              if (compiler.command === "bash" && process.platform === "win32") {
                // on Windows it's using the WSL (Windows Subsystem Linux)
                // So we convert the path to from c:\abc to /mnt/c/abc.....
                fileName = fileName
                  .replace(/c\:/, "/mnt/c")
                  .replace(/\\/g, "/");
              }
              if (compiler.command == "elixir") {
                spawnOptions.shell = true;
              }
            }

            if (compiler.args) {
              compilerArgs = compiler.args.replace(/<file>/g, fileName).replace(
                /<fileNoExt>/g,
                fileName
                  .split(".")
                  .slice(0, -1)
                  .join(".")
              );
            }
            args = compilerArgs.split(" ");
            let fileArgsObj = require("minimist")(fileArgs);

            if (fileArgsObj._ && fileArgsObj._.length === 0) {
              delete fileArgsObj._;
            }

            if (startData._ && startData._.length === 0) {
              delete startData._;
            }

            Object.assign(fileArgsObj, startData);

            const cmd = compiler.command ? compiler.command : args.shift();

            if (compiler.stream) {
              stream = compiler.stream;
            }

            nexssResult.push({
              stream,
              cmd: path.normalize(cmd),
              args,
              options: spawnOptions,
              fileName: path.normalize(fileName),
              fileArgs: fileArgsObj,
              cwd: PROCESS_CWD
            });
          }

          // BUILDING builder.build &&
          if (builder && (!compilerAdded || cliArgs.build)) {
            // We create folder for builds..
            if (!fs.existsSync(`_nexss`)) {
              try {
                fs.mkdirSync(`_nexss`, { recursive: true });
              } catch (err) {
                if (err.code !== "EEXIST") throw err;
              }
            }
            // We add exe to the file name as build file.
            let exeFile = path.resolve(`_nexss/${path.basename(fileName)}.exe`);

            let cmd;
            if (await is("Function", builder.build)) {
              cmd = builder.build();
            } else {
              cmd = builder.build;
            }

            if (!cmd) cmd = builder.cmd;
            ensureInstalled(cmd, builder.install);

            const builderArgs = builder.args
              .replace(/<file>/g, path.resolve(fileName))
              //.replace(/<destinationPath>/g, dirname(exeFile))
              .replace(/<destinationFile>/g, exeFile)
              .replace(/<destinationDirectory>/g, path.dirname(exeFile))
              .split(" ");

            nexssBuild.push({
              stream: "transformNexss",
              cmd,
              args: builderArgs,
              options: spawnOptions,
              fileName
            });

            nexssBuild.push({
              stream: "transformError",
              cmd: "BUILD RESULTS:",
              options: spawnOptions,
              fileName
            });
            if (cliArgs.verbose) {
              dbg(
                `Build Command ${cmd} ${
                  builderArgs ? builderArgs.join(" ") : ""
                }`
              );
            }

            nexssResult.push({
              stream: "transformNexss",
              cmd: exeFile,
              args: fileArgs.args
                ? fileArgs.args
                    .replace(/<file>/g, fileName)
                    //.replace(/<destinationPath>/g, dirname(exeFile))
                    .replace(/<destinationFile>/g, exeFile)
                    .replace(/<destinationDirectory>/g, path.dirname(exeFile))
                    .split(" ")
                : [],
              fileName
            });
          }
      }

      // We check if there are errors.
      // nexssResult.push({
      //   stream: "transformError",
      //   cmd: `Error Recognition for ${fileName}`,
      //   fileName
      //   // options: spawnOptions
      // });
      if (nexssInput) {
        nexssResult.push({
          stream: "transformOutput",
          cmd: "out"
          // options: spawnOptions
        });
      }
    }
    // if (process.nexssConfigContent) {
    //   nexssResult.push({
    //     stream: "transformValidation",
    //     cmd: `output`
    //   });
    // }
    if (nexssInput) {
      nexssResult.push({
        stream: "transformTest",
        cmd: `Test`
      });
    }

    nexssResult.push({
      stream: "writeableStdout",
      cmd: "out"
      // options: spawnOptions
    });

    // This needs to be changed so only build if is necessary
    if (nexssBuild.length > 1) {
      // console.log(nexssBuild);
      // process.exit(1);
      dy(`Building..`);
      await run(nexssBuild, {
        quiet: !cliArgs.verbose,
        build: true
      }).catch(e => console.error(e));
    }

    dg(`Executing..`);
    // console.log(nexssResult);
    // process.exit(1);
    await run(nexssResult, { quiet: !cliArgs.verbose }).catch(e =>
      console.error(e)
    );
  })().catch(xxx => {
    console.error(xxx);
  });
}
