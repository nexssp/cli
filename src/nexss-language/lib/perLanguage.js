const perLanguage = (extension) => {
  const { getLangByFilename } = require("./language");

  // We check if thiscan be language specified action like
  // --> eg. nexss js install socketio
  const languageSelected = getLangByFilename(`example.${extension}`);
  // To use lang specific commands use
  // `nexss js install OR nexss php install` NOT!-> nexss .js install
  if (extension.split(".").length === 1 && languageSelected) {
    const { getCompiler } = require("./compiler");
    const compiler = getCompiler({
      path: "",
      name: `test${languageSelected.extensions[0]}`,
    });

    let builder;
    if (!compiler) {
      const { getBuilder } = require("./nexss-start/lib/start/builder");
      builder = getBuilder({
        path: "",
        name: `test${languageSelected.extensions[0]}`,
      });
    }

    let pmArguments = process.argv.slice(4);
    const argsNoAffect = [
      "--",
      "--nocache",
      "--debug",
      "--progress",
      "--nxsLearning",
    ];

    pmArguments = pmArguments.filter((e) => !argsNoAffect.includes(e));

    // INSTALL / UNINSTALL
    if (
      (process.argv[3] === "install" || process.argv[3] === "uninstall") &&
      (!process.argv[4] || argsNoAffect.includes(process.argv[4]))
    ) {
      if (process.argv[4] === "--" || process.argv[4] === "--nocache") {
        delete process.argv[4];
      }

      if (process.argv[3] === "install") {
        const installCommand = `${
          compiler && compiler.install ? compiler.install : builder.install
        } ${pmArguments.join(" ")}`;

        const command = `${
          compiler && compiler.install ? compiler.command : builder.command
        } ${pmArguments.join(" ")}`;

        const { ensureInstalled } = require("./lib/terminal");

        let p = ensureInstalled(command, installCommand, { verbose: true });
        if (p) {
          log.info(
            `${blue(bold(languageSelected.title))} is installed at:\n${p}`
          );
        }
      } else {
        //uninstall
        // TODO: Implement uninstalling..
        console.log(`Uninstalling is here`);
      }

      // try {
      //   child_process.execSync(command, {
      //     stdio: "inherit",
      //     detached: false,
      //     shell: process.shell,
      //     cwd: process.cwd(),
      //   });
      // } catch (error) {
      //   console.log(`Command failed ${command}`);
      // }
      return;
    }

    // Package managers
    const pm = languageSelected.languagePackageManagers
      ? languageSelected.languagePackageManagers[
          Object.keys(languageSelected.languagePackageManagers)[0]
        ]
      : null;

    cliArgs._.shift();
    const argument = cliArgs._.shift();
    // console.log(argument);

    // custom actions like display compilers etc
    // eg nexss js compilers, nexss js builders

    // SET default compilers, builders for each language
    switch (argument) {
      case "default":
        // Set default compilator eg nexss lua default compiler
        let whatToSet = cliArgs._.shift();
        let toSet = cliArgs._.shift();
        switch (whatToSet) {
          case "compilers":
          case "compiler":
            whatToSet = "compilers";
            break;
          case "builders":
          case "builder":
            whatToSet = "builders";
            break;
          case "languagePackageManagers":
          case "pm":
          case "packageManager":
            whatToSet = "languagePackageManagers";
            break;
          default:
            if (whatToSet) {
              log.error(`You cannot specify ${whatToSet}.`);
            } else {
              log.error(`What you want to change?`);
            }

            log.error(`Use ${bold("compiler, builder, packageManager or pm")}`);

            return;
        }

        // TODO: Later move the function to config (see config path is also used below)
        let config;
        const configPath = process.env.NEXSS_HOME_PATH + "/config.json";
        if (fs.existsSync(configPath)) {
          config = require(configPath);
        } else {
          config = { languages: {} };
        }

        const firstName = Object.keys(languageSelected[whatToSet])[0];
        if (!toSet) {
          if (Object.keys(languageSelected[whatToSet]).length) {
            log.error(
              `Specify '${bold(whatToSet)}' name to set eg: nexss '${bold(
                extension
              )} ${argument} compiler ${bold(firstName)}'`
            );

            console.log(bold(`List of ${whatToSet}:`));
            let firstCompiler;
            Object.keys(languageSelected[whatToSet]).forEach((w) => {
              if (!firstCompiler) {
                firstCompiler = w;
              }
              console.log(bold(w), languageSelected[whatToSet][w]);
            });
            if (config.languages && config.languages[extension]) {
              console.log(
                `Default ${whatToSet.slice(0, -1)} is set to ${bold(
                  config.languages[extension][whatToSet]
                )}`
              );
            } else {
              console.log(
                `Default compiler has not been set. First on the list (${bold(
                  firstCompiler
                )}) is as default.`
              );
            }
          } else {
            log.warn(
              `No ${bold(whatToSet)} specified in the configuration for ${bold(
                extension
              )}.`
            );
          }

          process.exit();
        }

        if (
          !languageSelected[whatToSet][toSet] &&
          toSet.toLowerCase() !== "unset"
        ) {
          log.error(
            `Compiler '${bold(
              toSet
            )}' does not exist. Use existing one eg  'nexss ${extension} ${argument} compiler ${firstName}'`
          );
          if (Object.keys(languageSelected[whatToSet]).length) {
            console.log(bold(`List of ${whatToSet}:`));
            Object.keys(languageSelected[whatToSet]).forEach((w) => {
              console.log(bold(w), languageSelected[whatToSet][w]);
            });
          } else {
            log.warn(
              `No ${bold(whatToSet)} specified in the configuration for ${bold(
                extension
              )}.`
            );
          }

          process.exit();
        }

        if (!config.languages[extension]) {
          config.languages[extension] = {};
        }

        if (toSet === "unset") {
          delete config.languages[extension][whatToSet];
          toSet = Object.keys(languageSelected[whatToSet])[0];
        } else {
          config.languages[extension][whatToSet] = toSet;
        }

        if (!languageSelected[whatToSet][toSet].switch) {
          languageSelected[whatToSet][toSet].switch = languageSelected[
            whatToSet
          ][toSet].install.replace(/install/g, "reset");
        }

        fs.writeFileSync(configPath, JSON.stringify(config));

        if (languageSelected[whatToSet][toSet]) {
          //Reseting to the version
          if (process.platform === "win32") {
            // Versions bucket only for Windows / Scoop
            const { ensureBucketAdded } = require("./lib/scoop");
            ensureBucketAdded("versions");
          }

          const command = `${languageSelected[whatToSet][toSet].install} && ${languageSelected[whatToSet][toSet].switch}`;

          try {
            child_process.execSync(command, {
              stdio: "inherit",
              detached: false,
              shell: process.shell,
              cwd: process.cwd(),
              maxBuffer: 1024 * 1024 * 100,
            });
          } catch (error) {
            console.log(
              `Command failed ${languageSelected[whatToSet][toSet].switch}`
            );
          }
        }

        log.ok(
          `${whatToSet} has been set for language ${extension} ${argument} compiler ${toSet}'`
        );

        process.exit(0);
      case "compilers":
        console.log(languageSelected.compilers);
        process.exit(0);
      case "builders":
        console.log(languageSelected.builders);
        process.exit(0);
      case "errors":
        console.log(languageSelected.errors);
        process.exit(0);
      case "pm":
      case "packageManagers":
        console.log(languageSelected.languagePackageManagers);
        process.exit(0);
      case "info":
        const info = {
          title: languageSelected.title,
          url: languageSelected.url,
          description: languageSelected.description,
          extensions: languageSelected.extensions,
          configFile: languageSelected.configFile,
        };
        if (process.argv.includes("--json")) {
          console.info(JSON.stringify(info));
        } else {
          console.info(info);
        }

        process.exit(0);
      case "config":
        // Object.keys(languageSelected).forEach(element => {
        //   if (typeof languageSelected[element] === "object") {
        //     console.log(`${element}:`, languageSelected[element]);
        //   } else {
        //     if (languageSelected[element])
        //       console.log(`${element}: ${languageSelected[element]}`);
        //   }
        // });

        if (process.argv.includes("--json")) {
          console.info(JSON.stringify(languageSelected));
        } else {
          console.info(languageSelected);
        }

        process.exit(0);
      case "run":
        // TODO: Refactor later for DRY.

        const installCommand = `${
          compiler && compiler.install ? compiler.install : builder.install
        }`;

        const command = `${
          compiler && compiler.install ? compiler.command : builder.command
        }`;

        const { ensureInstalled } = require("./lib/terminal");
        ensureInstalled(command, installCommand, { verbose: true });

        // Below runs like:
        // Per compiler run command if not exists main run command else display error that is not specified.
        const configPath2 = process.env.NEXSS_HOME_PATH + "/config.json";
        let config2;
        if (fs.existsSync(configPath2)) {
          config2 = require(configPath2);
        } else {
          config2 = { languages: {} };
        }

        // const compiler = getCompiler({
        //   path: "",
        //   name: `test${languageSelected.extensions[0]}`,
        // });
        // let builder;
        // if (!compiler) {
        //   const { getBuilder } = require("./nexss-start/lib/start/builder");
        //   builder = getBuilder({
        //     path: "",
        //     name: `test${languageSelected.extensions[0]}`,
        //   });
        // }

        let runCommand =
          (compiler && compiler.run) ||
          (builder && builder.run) ||
          languageSelected["run"];

        if (!runCommand) {
          log.error(
            bold(
              `Run command is not setup in the configuration for ${languageSelected.title} and os: ${process.distro}`
            )
          );
          log.info(
            bold(
              `Try to add your own run function. (eg add to the file languageConfig.run='your command to run')`
            )
          );
          log.info(bold(`Config file: ${languageSelected.configFile}`));
          log.info(
            bold(
              `Please remember to use --nocache if you change the language config file.`
            )
          );
          process.exit(1);
        }

        if (
          Object.prototype.toString.call(runCommand) === `[object Function]`
        ) {
          log.dg(`Running FUNCTION ${argument}(${cliArgs._.join(",")})`);
          runCommand(...cliArgs._);
        } else {
          const pmArguments = process.argv.slice(4);
          runCommand =
            runCommand &&
            runCommand.replace(
              "<currentCommand>",
              compiler.command || builder.command
            );

          function escapeShellArg(arg) {
            return `"${arg}"`;
          }
          const arguments =
            process.platform === "win32"
              ? `${pmArguments.join(" ")}`
              : `${pmArguments.map(escapeShellArg).join(" ")}`;

          const command = `${runCommand} ${arguments}`;
          const spawnOptions = require("./config/spawnOptions");

          log.dg(`RUN: ${bold(command)}, cwd: ${process.cwd()}`);

          try {
            child_process.execSync(
              command,
              spawnOptions({
                stdio: "inherit",
                detached: false,
                cwd: process.cwd(),
                maxBuffer: 1024 * 1024 * 100,
              })
            );
          } catch (error) {
            console.log(`Command failed ${command}`);
          }
        }
        return;
      default:
        break;
    }

    log.di(`Language selected: ${bold(languageSelected.title)}`);

    if (pm) {
      const action = pm[argument];

      if (
        !action ||
        (process.argv[3].startsWith("-") &&
          !process.argv[3].startsWith("--nxs"))
      ) {
        if (argument && !process.argv[3].startsWith("-")) {
          log.warn(
            `Action '${argument}' does not exist for ${bold(
              languageSelected.title
            )}`
          );
        }

        const { getCompiler } = require("./compiler");
        let compiler = getCompiler({
          path: "",
          name: `test${languageSelected.extensions[0]}`,
        });
        const { ensureInstalled } = require("../../lib/terminal");
        if (!compiler) {
          compiler = builder;
        }

        ensureInstalled(compiler.command, compiler.install);

        const pmArguments = process.argv.slice(3);
        const command = `${
          compiler.shell ? compiler.shell : compiler.command
        } ${pmArguments.join(" ")}`;

        try {
          child_process.execSync(command, {
            stdio: "inherit",
            detached: false,
            shell: process.shell,
            cwd: process.cwd(),
            maxBuffer: 1024 * 1024 * 100,
          });
        } catch (error) {
          console.log(`Command failed ${command}`);
        }
      } else {
        if (Object.prototype.toString.call(action) === `[object Function]`) {
          log.dg(`Running FUNCTION ${argument}(${cliArgs._.join(",")})`);
          action(...cliArgs._);
        } else {
          const pmArguments = process.argv.slice(4);
          let command = `${action} ${pmArguments.join(" ")}`;

          command =
            command &&
            command.replace(
              "<currentCommand>",
              compiler.command || builder.command
            );

          log.info(`Execute: ${bold(command)}, cwd: ${process.cwd()}`);

          try {
            require("child_process").execSync(command, {
              stdio: "inherit",
              detached: false,
              shell: process.shell,
              cwd: process.cwd(),
              maxBuffer: 1024 * 1024 * 100,
            });
          } catch (error) {
            console.log(`Command failed ${command}`);
          }
        }
      }
    } else {
      log.info(`No actions for '${extension}'`);
    }
  } else {
    // File not found OR no actions can be performed

    console.log(
      `${bold(extension)} has not been found. 
To add new file please use command ${bold("nexss file add " + extension)}`
    );
    //
  }
};

module.exports = { perLanguage };
