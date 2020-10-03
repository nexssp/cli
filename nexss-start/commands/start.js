const { exit } = require("process");

Nexss();

function Nexss() {
  const { NEXSS_SPECIAL_CHAR } = require("../../config/defaults"),
    { error, warn, di, dg, dbg } = require("@nexssp/logdebug"),
    // const dotenv = require("dotenv");
    { inspect } = require("util"),
    { yellow } = require("@nexssp/ansi"),
    { startServer } = require("../../lib/server"),
    { ensureInstalled, pathWinToLinux } = require("../../lib/terminal"),
    { isURL } = require("../../lib/data/url"),
    { getFiles } = require("../lib/start/files"),
    url = require("url");

  // nexss s OR nexss start is ommiting
  let paramNumber = 2;
  if (process.argv[2] === "s" || process.argv[2] === "start") {
    paramNumber = 3;
  }
  const cliArgs = require("minimist")(process.argv.slice(paramNumber));

  let fileOrDirectory = Array.isArray(cliArgs._) && cliArgs._.shift();

  if (
    (!fileOrDirectory && process.argv[2] === "start") ||
    process.argv[2] === "s"
  ) {
    fileOrDirectory = ".";
  }

  if (fileOrDirectory) {
    if (
      path.extname(fileOrDirectory) === ".nexss"
      // &&process.argv.includes("--nexssScript")
    ) {
      if (fs.existsSync(fileOrDirectory)) {
        const nexssProgram = fs.readFileSync(fileOrDirectory);
        files = require("../lib/nexssFileParser")(
          nexssProgram,
          fileOrDirectory,
          cliArgs
        );
      }
    } else {
      // CLEANUP IF THIS IS NOT URL, REMOVE END / OR \ AND REPLACE TO /
      if (!isURL(fileOrDirectory)) {
        fileOrDirectory = fileOrDirectory.replace(/\\/g, "/");
        fileOrDirectory = path
          .normalize(fileOrDirectory)
          .replace(/(\/|\\)$/, "");
      }

      if (fileOrDirectory === "." && !fs.existsSync("./_nexss.yml")) {
        warn("Nothing to run");
        process.exit(0);
      }

      let firstParam = { name: fileOrDirectory };
      if (cliArgs.seq) {
        firstParam.seq = cliArgs.seq;
      }
      files = getFiles(firstParam);
    }
  }

  const { loadConfigContent } = require("../../lib/config");

  let nexssConfig;

  if (
    !isURL(fileOrDirectory) &&
    !fileOrDirectory.startsWith(NEXSS_SPECIAL_CHAR)
  ) {
    if (fs.lstatSync(fileOrDirectory).isFile()) {
      const dirname = path.dirname(fileOrDirectory);
      const configFileDirname = `${dirname}/_nexss.yml`;
      if (fs.existsSync(configFileDirname) && fs.lstatSync(configFileDirname)) {
        nexssConfig = loadConfigContent(configFileDirname);
      }
    } else {
      nexssConfig = loadConfigContent(`${fileOrDirectory}/_nexss.yml`);
    }
  }

  if (!Array.isArray(files)) {
    files = [files];
  }

  files = files.filter(Boolean);

  const cache = require("../../lib/cache");
  const cacheFileName = "myCache.json";
  let nexssResult = [];
  let nexssBuild = [];

  if (cliArgs.server) {
    // SERVER
    if (nexssConfig) {
      startServer(nexssConfig.server, { cwd: PROCESS_CWD });
    } else {
      startServer({}, { cwd: PROCESS_CWD });
    }
  } else {
    if (!cliArgs.nxsLive || !cache.exists(cacheFileName, "1y")) {
      if (files.length === 0) {
        warn(
          "Nothing to run. To add files to the project please use 'nexss file add myfile.[language extension]'"
        );
        process.exit();
      }

      // more here: https://github.com/nexssp/cli/wiki/Config
      let startData = {
        debug: (nexssConfig && nexssConfig.debug) || cliArgs.debug,
      };

      if (nexssConfig && nexssConfig.data)
        Object.assign(startData, nexssConfig.data);

      if (cliArgs.debug) di(`startData: ${yellow(inspect(startData))}`);

      nexssBuild.push({ stream: "readable", cmd: startData });

      if (cliArgs.debug) {
        nexssBuild.push({
          stream: "transformError",
          cmd: "Builder Started.",
        });
      }

      // let nexssResult = [() => "process.stdin"];

      const noStdin = process.argv.includes("--nxsOnly");
      nexssResult.push({ stream: "readable", cmd: startData });
      // { stream: "transformError", cmd: "Some text" }

      const { getCompiler } = require("../lib/start/compiler");
      const { getBuilder } = require("../lib/start/builder");

      for (let file of files) {
        let fileName = file.name;

        dg(`Parsing ${fileName}..`);

        if (file.path && fs.existsSync(file.path)) process.chdir(file.path);

        process.nexssCWD = file.path;
        process.nexssFilename = path.normalize(fileName);

        if (!file.name) {
          error(
            "file needs to have `name` field in the `files` section of the _nexss.yml config file. Please see examples/packages."
          );
          process.exit();
        }
        if (!noStdin) {
          let transformInParams = {
            stream: "transformInput",
            cmd: "in",
          };

          if (file.args) {
            transformInParams.inputData = file.args;
          }

          if (file.data) {
            transformInParams.inputData = file.data;
            delete file.data;
          }

          nexssResult.push(transformInParams);
        }
        let stream = "transformNexss";

        const parsed = url.parse(fileName);
        if (parsed.hash) {
          const fileArgsHash = file.args;
          delete file.args;
          nexssResult.push({
            stream: "transformHash",
            cmd: file,
          });
        } else {
          if (parsed.href) {
            switch (parsed.protocol) {
              case "http:":
              case "https:":
                nexssResult.push({
                  stream: "transformRequest",
                  cmd: fileName,
                  // options: spawnOptions
                });
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

                let spawnOptions = { detached: true };

                let compiler = Object.assign({}, getCompiler(file));
                if (Object.keys(compiler).length > 0) {
                  if (compiler.args) {
                    // console.log(compiler.args, "REPLACE", fileName);

                    compiler.args = compiler.args
                      .replace(/<file>/g, fileName)
                      .replace(
                        /<fileNoExt>/g,
                        fileName.split(".").slice(0, -1).join(".")
                      );

                    compiler.args = compiler.args.split(" ");
                  }

                  let builder;

                  if (
                    !builder ||
                    (compiler && compiler.args && !cliArgs.nxsBuild)
                  ) {
                    // We make sure compiler is installed
                    compilerAdded = true;
                    if (compiler.command) {
                      // Installation of the compiler
                      let compilerInstallOptions = {};

                      if (compiler.shell) {
                        compilerInstallOptions = { shell: "Powershell" };
                      }

                      ensureInstalled(
                        compiler.command,
                        compiler.install,
                        compilerInstallOptions
                      );

                      if (
                        (compiler.command === "bash" ||
                          compiler.command === "wsl") &&
                        process.platform === "win32"
                      ) {
                        // on Windows it's using the WSL (Windows Subsystem Linux)
                        // So we convert the path to from c:\abc to /mnt/c/abc.....
                        try {
                          if (!Array.isArray(compiler.args)) {
                            compiler.args = pathWinToLinux(compiler.args);
                          } else {
                            compiler.args = compiler.args.map((e) =>
                              pathWinToLinux(e)
                            );
                          }
                        } catch (error) {
                          console.error(
                            "args on the compiler: ",
                            compiler.args
                          );
                        }
                      }
                      if (compiler.command == "elixir") {
                        spawnOptions.shell = true;
                      }
                    }

                    let fileArgs;
                    if (file.args) {
                      fileArgs = file.args;
                    }

                    let cmd =
                      compiler.command ||
                      (compiler.args && compiler.args.shift());

                    // VALIDATION
                    if (file.input) {
                      nexssResult.push({
                        stream: "transformValidation",
                        cmd: `input`,
                        args: file.input,
                      });
                    }

                    if (compiler && compiler.stream) {
                      stream = compiler.stream;
                    }
                    nexssResult.push({
                      stream,
                      // eg. cmd = php
                      cmd,
                      // args = ["my.php", "args from config", "static args"]
                      args: compiler.args,
                      data: file.data,
                      options: spawnOptions,
                      fileName: path.normalize(fileName),
                      // inputData: fileArgs,
                      cwd: file.path,
                      env: file.env ? file.env : null,
                    });
                  }
                } else {
                  const builder = getBuilder(file);

                  let exeFile = path.resolve(
                    `_nexss/${path.basename(fileName)}.exe`
                  );
                  const builderArgs = builder.args
                    .replace(/<file>/g, path.resolve(fileName))
                    //.replace(/<destinationPath>/g, dirname(exeFile))
                    .replace(/<destinationFile>/g, exeFile)
                    .replace(/<destinationDirectory>/g, path.dirname(exeFile))
                    .split(" ");

                  nexssResult.push({
                    stream: "transformNexss",
                    cmd,
                    args: builderArgs,
                    options: spawnOptions,
                    fileName,
                  });

                  nexssBuild.push({
                    stream: "transformError",
                    cmd: "BUILD RESULTS:",
                    options: spawnOptions,
                    fileName,
                  });

                  if (cliArgs.verbose) {
                    dbg(
                      `Build Command ${cmd} ${
                        builderArgs ? builderArgs.join(" ") : ""
                      }`
                    );
                  }
                }

              // Below is for extra transfers from data for each output of the module
            }
          }
        }

        nexssResult.push({
          stream: "transformOutput",
          cmd: "out",
          // options: spawnOptions
        });

        // VALIDATION - OUTPUT
        if (file.output) {
          nexssResult.push({
            stream: "transformValidation",
            cmd: `output`,
            args: file.output,
          });
        }
      }

      // TEST
      nexssResult.push({
        stream: "transformTest",
        cmd: `Test`,
      });

      nexssResult.push({
        stream: "writeableStdout",
        cmd: "out",
        // options: spawnOptions
      });

      cache.writeJSON(cacheFileName, nexssResult);
    } else {
      nexssResult = cache.readJSON(cacheFileName);
    }

    const { run } = require("../lib/pipe");
    // This needs to be changed so only build if is necessary
    // if (nexssBuild.length > 0) {
    //   dy(`Building..`);
    //   run(nexssBuild, {
    //     quiet: !cliArgs.verbose,
    //     build: true
    //   }).catch(e => console.error(e));
    // }
    const json = require("../../lib/data/json");

    // console.log(nexssBuild);
    process.chdir(PROCESS_CWD); //TODO: Later to recheck folder changing on getFiles + mess cleanup

    // Recheck the Serialize (later remove??)
    nexssResult = json.parse(json.stringify(nexssResult));
    dg("Executing..");

    if (cliArgs.nxsBuild) {
      let buildFilename = "./build.nexss.json";
      db(`option nxsBuild -> building and write to ${buildFilename}`);

      if (typeof cliArgs.nxsBuild !== "boolean") {
        buildFilename = cliArgs.nxsBuild;
        if (cliArgs.nxsBuild.indexOf(".json") <= 0) {
          buildFilename += ".json";
        }
      }
      fs.writeFileSync(buildFilename, JSON.stringify(nexssResult, null, 2));
    }

    // We do not run, just display info
    if (cliArgs.nxsDry) {
      console.log(JSON.stringify(nexssResult, null, 2));
      process.exit(0);
    }

    run(nexssResult, { quiet: !cliArgs.verbose }).catch((e) =>
      console.error(e)
    );
  }
}
