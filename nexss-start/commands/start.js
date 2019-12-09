const PROCESS_CWD = process.cwd();
const path = require("path");
const { info, error, warn, di, dg, dy } = require("../../lib/log");
const dotenv = require("dotenv");
const { inspect } = require("util"),
  { blue, bold, green } = require("../../lib/color"),
  { startServer } = require("../../lib/server"),
  { getLangByFilename } = require("../../nexss-language/lib/language");
const { is, Exists } = require("../../lib/data/guard");
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

// if you put -seq=myseq it will run sequence more on Demos
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
  nexssConfig.server &&
  (cliArgs.server || files.length === 0)
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

  Object.assign(startData, cliArgs);

  if (cliArgs.test) {
    info(green(bold("Testing enabled")));
    Object.assign(startData, {
      number: 369369,
      string: "This is string",
      Unicode: "½¼¾¿®¢£¤¥§óęśćźżÓŚĆŹŻäöüß€яшдфгчйкльжѠ" // For testing purposes
    });
  }

  const stdin = () => {
    if (process.platform !== "win32") {
      // Linux fix
      process.stdin.resume();
    }
    var chunks = [];
    try {
      do {
        var chunk = readFileSync(0, "utf8");
        chunks.push(chunk);
      } while (chunk.length);
    } catch (error) {
      // console.error(`STDIN Error: ${error}`);
      // console.trace();
      if (process.platform !== "win32") {
        process.stdin.destroy();
      }
    }

    return chunks.join("");
  };

  const stdinRead = stdin();
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
      let compiler = null;
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

      if (!file.name) {
        error(
          "file needs to have `name` field in the `files` section of the _nexss.yml config file. Please see examples/packages to grasp the idea."
        );
        process.exit(1);
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
              }
            }
          }

          let languageDefinition = getLangByFilename(fileName);

          ld_compiler = languageDefinition.compilers;

          if (file.compiler) {
            fileCompilerSplit = file.compiler.split(" ");

            if (ld_compiler[fileCompilerSplit[0]]) {
              compiler = ld_compiler[fileCompilerSplit[0]];

              fileCompilerSplit.shift();
              compiler.args = fileCompilerSplit.concat(compiler.args).join(" ");
            }
          } else {
            if (languageDefinition) {
              // !?@#$%
              compiler = Object.assign(
                {},
                languageDefinition.getFirst("compilers")
              );
            } else {
              compiler = {};
              compiler.command = "nexss";
              compiler.args = `${fileName} ${fileArgs.join(" ")}`;
            }
          }

          let builder;
          if (languageDefinition) {
            builder = languageDefinition.getFirst("builders");
          }

          // dg(`COMPILER IN`, compiler);
          let spawnOptions = { detached: true };
          let compilerAdded = false;

          if (compiler && compiler.args && !cliArgs.build) {
            // We make sure compiler is installed
            compilerAdded = true;
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

            args = compiler.args.split(" ");

            let fileArgsObj = require("minimist")(fileArgs);

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

          if (builder && builder.build && (!compilerAdded || cliArgs.build)) {
            if (!fs.existsSync(`_nexss`)) {
              try {
                fs.mkdirSync(`_nexss`, { recursive: true });
              } catch (err) {
                if (err.code !== "EEXIST") throw err;
              }
            }

            let exeFile = path.resolve(`_nexss/${path.basename(fileName)}.exe`);

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
            if (cliArgs.verbose) {
              console.log(
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
    }

    nexssResult.push({
      stream: "writeableStdout",
      cmd: "out"
      // options: spawnOptions
    });

    // This needs to be changed so only build if is necessary
    if (nexssBuild.length > 0 && cliArgs.build) {
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
