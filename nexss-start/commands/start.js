const PROCESS_CWD = process.cwd();
const path = require("path");
const { info, error, warn, db, di, dg, dy, trace } = require("../../lib/log");
const dotenv = require("dotenv");
const { promisify, inspect } = require("util"),
  { blue, red, yellow, bold, green } = require("../../lib/color"),
  { startServer } = require("../../lib/server"),
  { getLangByFilename } = require("../../nexss-language/lib/language");
const { is, isOlder, Exists } = require("../../lib/data/guard");
const { ensureInstalled } = require("../../lib/terminal");
const fs = require("fs");
const { readFileSync, existsSync, lstatSync } = require("fs");
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

let fileOrDirectory = is("Array", cliArgs._) && cliArgs._.shift();

// There is an argument so we check if this is folder
if (fileOrDirectory) {
  if (!isURL(fileOrDirectory)) {
    fileOrDirectory = fileOrDirectory.replace(/\\/g, "/");
    fileOrDirectory = path.normalize(fileOrDirectory).replace(/(\/|\\)$/, "");
  }

  //replace only first occurance
  const platformDir = `${fileOrDirectory}/${process.platform}`;
  const platformExists = existsSync(platformDir);
  // We check if the platformDir

  if (platformExists && lstatSync(`${platformDir}`).isDirectory()) {
    process.chdir(platformDir);
    // console.log("chaning dir PLATFORM SPECIFIC", fileOrDirectory);
    fileOrDirectory = null;
  } else if (
    existsSync(`${fileOrDirectory}`) &&
    lstatSync(`${fileOrDirectory}`).isDirectory()
  ) {
    // console.log("chaning dir =-=============================", fileOrDirectory);
    // console.log("PROCESS CWD!!!!!!!!!!!!! start.js / fileORDir", process.cwd());
    process.chdir(fileOrDirectory);

    fileOrDirectory = null;
  } else {
    const nexssConfig = require("../../lib/config").loadConfigContent();
    //We check if there is config already

    // console.log("not is url", fileOrDirectory);
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

const nexssConfig = require("../../lib/config").loadConfigContent();

// if (nexssConfig.env) {
//   //set environment variables
// }

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

// console.log(nexssConfig.sequences[cliArgs.seq], cliArgs.seq);

if (
  cliArgs.seq &&
  nexssConfig.sequences &&
  nexssConfig.sequences[cliArgs.seq]
) {
  files = nexssConfig.sequences[cliArgs.seq];
} else {
  if (cliArgs.seq) {
    if (
      nexssConfig &&
      nexssConfig.sequences &&
      !nexssConfig.sequences[cliArgs.seq]
    ) {
      error(`${cliArgs.seq} sequence does not exist in the _nexss.yml`);
      process.exit(1);
    }
  }

  files = fileOrDirectory || (nexssConfig && nexssConfig.files) || [];
}

if (
  nexssConfig &&
  (nexssConfig.server && (cliArgs.server || files.length === 0))
) {
  startServer(nexssConfig.server, nexssConfig.router || {});
} else {
  if (files.length === 0) {
    warn("Nothing to run");
    process.exit(1);
  }

  let startData = (nexssConfig && nexssConfig.data) || {};
  startData.start = Date.now();
  startData.cwd = PROCESS_CWD;
  startData.debug = nexssConfig && nexssConfig.debug;

  const { run } = require("../lib/pipe");
  // console.log("!!!!!!!!!!!!!!!cli args!!!!!!", cliArgs);

  Object.assign(startData, cliArgs);

  if (cliArgs.test) {
    info(green(bold("Testing enabled")));
    Object.assign(startData, {
      number: 369369,
      string: "This is string",
      pilishSigns: "óęśćźżÓŚĆŹŻ"
    });
  }
  // console.log(startData);
  // TODO: Later to handle stdin as a stream!!!!

  const stdin = () => {
    var chunks = [];
    try {
      do {
        var chunk = readFileSync(0, "utf8");
        chunks.push(chunk);
      } while (chunk.length);
    } catch (error) {
      // console.error(`STDIN Error: ${error}`);
      // console.trace();
    }
    return chunks.join("");
  };

  const stdinRead = stdin();
  // console.log("STDIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", stdinRead);
  let dataStdin = {};
  if (stdinRead) {
    try {
      dataStdin = JSON.parse(stdinRead);
    } catch (error) {
      dataStdin.nexssStdin = stdinRead;
    }

    Object.assign(startData, dataStdin);
  }
  if (cliArgs.verbose) di(`startData: ${blue(inspect(startData))}`);

  const globalBuild = (nexssConfig && nexssConfig.build) || undefined;
  const globalDisabled = nexssConfig && nexssConfig.disabled;
  let nexssBuild = [
    () => {
      var Readable = require("stream").Readable;
      var s = new Readable();
      s._read = () => {};
      s.push(JSON.stringify(startData));
      s.push(null);
      return s;
    },
    { stream: "transformError", cmd: "Builder Started." }
  ];
  // let nexssResult = [() => "process.stdin"];
  let nexssResult = [
    () => {
      var Readable = require("stream").Readable;
      var s = new Readable();
      s._read = () => {};
      s.push(JSON.stringify(startData));
      s.push(null);
      return s;
    }
    // { stream: "transformError", cmd: "Some text" }
  ];

  if (cliArgs.test) {
    nexssResult.push(() => {
      var Transform = require("stream").Transform;
      var s = new Transform();
      s._transform = function(obj, encoding, cb) {
        let c = JSON.parse(obj.toString());
        c.transformWorks = "ąęćśŻó";
        this.push(JSON.stringify(c));
        cb();
      };
      return s;
    });
  }

  (async () => {
    for await (let file of files) {
      // TODO: check this below
      //if (paramNumber === 3) {
      //this is nexss start or s so we change each time to the root of the project
      //as each file has relative path in nexss.yml
      if (projectPath) process.chdir(projectPath);
      //}

      if (cliArgs.verbose) dg(`Parsing ${file.name}..`);

      if (globalDisabled && file.disabled) {
        dy(`file ${file.name} is disabled or Global disabled. Going next..`);
        return;
      }

      let fileArgs = file.name.split(" ");
      let fileName = fileArgs.shift();
      let stream = "transformNexss";
      //we check protocol

      const parsed = url.parse(fileName);

      // for check if exists
      // let physical = true;
      switch (parsed.protocol) {
        case "http:":
        case "https:":
          stream = "transformRequest";

          nexssResult.push(() => request(fileName));
          break;
        // case "file:":
        //   stream = "transformFile";
        default:
          if (parsed.protocol) {
            fileName = fileName.substring(parsed.protocol.length + 2);
            if (parsed.protocol === "file:") {
              stream = "transformFile";
            }
          }

          // When this is not module..
          // if (!(await Exists(fileName))) {
          //   process.chdir(PROCESS_CWD);
          // }
          // console.log(
          //   "####1",
          //   fileName,
          //   "#",
          //   PROCESS_CWD,
          //   "# ",
          //   `${PROCESS_CWD}/${fileName}`
          // );
          if (!(await Exists(`${fileName}`))) {
            if (cliArgs.verbose)
              error(
                `File ${fileName} has not been found. Trying Packages folder`
              );

            fileName = `${NEXSS_PACKAGES_PATH}/${fileName}`;
            // console.log("####2", fileName);
            if (!(await Exists(fileName))) {
              error(`Nexss: ${fileName} has not been found.`);
              info(
                "Possible solution: remove file from files entry in the nexss.yml file."
              );
              return 0;
            } else {
              if (fs.lstatSync(fileName).isDirectory()) {
                process.chdir(fileName);
              } else {
                process.chdir(path.dirname(fileName));
              }
            }
          } else {
            //We change the directory to the file is in.
            //console.log(path.dirname(fileName));
            const oldFileName = fileName;
            fileName = `${fileName}`;
            // console.log(fileName);
            if (fs.existsSync(fileName)) {
              if (!fs.lstatSync(fileName).isDirectory()) {
                // console.log("xxxxxxxxxxx!!!!!!!!!!!!!!!!!!!!!", fileName);
                fileName = oldFileName;
                // process.chdir(PROCESS_CWD);
                // console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
              } else {
                process.chdir(fileName);
              }
              // console.log("xxxxxxxxxFILENAME: ", fileName);
            }
          }

          const languageDefinition = getLangByFilename(fileName);

          let compiler;
          compiler = languageDefinition.compilers;
          if (file.compiler) {
            fileCompilerSplit = file.compiler.split(" ");
            // console.log(fileCompilerSplit[0]);
            if (compiler[fileCompilerSplit[0]]) {
              compiler = compiler[fileCompilerSplit[0]];
              // compiler.command = compiler[fileCompilerSplit[0]].command;

              fileCompilerSplit.shift();
              compiler.args = fileCompilerSplit.concat(compiler.args).join(" ");
            }
          } else {
            if (languageDefinition) {
              compiler = languageDefinition.getFirst("compilers");
            } else {
              compiler = {};
              compiler.command = "nexss";
              compiler.args = `${fileName} ${fileArgs}`;
            }
          }

          let builder;
          if (languageDefinition) {
            builder = languageDefinition.getFirst("builders");
          }

          // dg(`COMPILER IN`, compiler);
          let spawnOptions = { detached: true };

          if (compiler && compiler.args && !cliArgs.build) {
            // We make sure compiler is installed
            if (compiler.command) {
              ensureInstalled(compiler.command, compiler.install);

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

            compiler.args = compiler.args.replace(/<file>/g, fileName).replace(
              /<fileNoExt>/g,
              fileName
                .split(".")
                .slice(0, -1)
                .join(".")
            );
            let args = compiler.args.split(" ");

            nexssResult.push({
              stream,
              cmd: compiler.command ? compiler.command : args.shift(),
              args,
              options: spawnOptions,
              fileName,
              cwd: PROCESS_CWD
            });
          }

          let exeFile = path.resolve(
            `../_nexss/${path.basename(fileName)}.exe`
          );
          // TODO: implement copy of language file to the repo
          if (cliArgs.build && builder && builder.build) {
            let cmd;
            if (await is("Function", builder.build)) {
              cmd = builder.build();
            } else {
              cmd = builder.build;
            }

            if (!cmd) cmd = builder.cmd;

            // console.log(builder);

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
            console.log(
              `Build Command ${cmd} ${builderArgs ? builderArgs.join(" ") : ""}`
            );

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
    }

    nexssResult.push({
      stream: "writeableStdout",
      cmd: "out"
      // options: spawnOptions
    });

    if (cliArgs.build) {
      dy(`Building..`, nexssBuild);
      await run(nexssBuild, { quiet: !cliArgs.verbose, build: true }).catch(e =>
        console.error(e)
      );
    }
    if (cliArgs.verbose) dg(`Executing..`);
    await run(nexssResult, { quiet: !cliArgs.verbose }).catch(e =>
      console.error(e)
    );
  })().catch(console.error);
}
