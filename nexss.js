#!/usr/bin/env node
/*
 * Title: Nexss Programmer CLI
 * Author: Marcin Polak / nexss.com
 * 2018/10/01 initial version
 */
Object.defineProperty(process, "startTime", {
  configurable: false,
  enumerable: true,
  value: process.hrtime(),
});

Object.defineProperty(process, "nexssGlobalCWD", {
  configurable: false,
  enumerable: true,
  value: process.cwd(),
});

process.on("unhandledRejection", (err, promise) => {
  console.log({ err, promise });
});

process.on("rejectionHandled", (err, promise) => {
  console.log({ promise });
});

// We make sure application is installed
const { npmInstallRun } = require("./lib/npm");
npmInstallRun();
require("./config/globals");

log.dc(bold("∞ Starting Nexss Programmer.."));
const { NEXSS_SRC_PATH, NEXSS_PACKAGES_PATH } = require("./config/config"); // .40

const { NEXSS_SPECIAL_CHAR } = require("./config/defaults");

const { isURL } = require("./lib/data/url");

process.title = `nexss (${require("./package.json").version}:${
  process.pid
}) ${process.argv.slice(2).join(" ")}`;

log.d("⊛ Set the process title: ", process.title);

// Core functions like version, update. All are located ./lib/core
// Example: nexss --env, or nexss --version

if (process.argv[2] && process.argv[2].startsWith("-")) {
  const f = process.argv[2];
  const functionsFolder = `./lib/core/${f}.js`;
  if (fs.existsSync(path.resolve(__dirname, functionsFolder))) {
    log.db(`Loading core${f} function, ${functionsFolder}`);
    const functionRun = require(functionsFolder);
    functionRun();
    return;
  }
}

// Get first parameter as plugin name.
let plugin = cliArgs._[0];
if (plugin) plugin += "";

// Aliases eg start -> s. Each package has also own aliases for commands.
const aliases = require("./aliases.json");
if (aliases[plugin]) {
  plugin = aliases[plugin];
}

if (!plugin) plugin = NEXSS_SPECIAL_CHAR;

// display main help eg: nexss help
if (!plugin.startsWith(NEXSS_SPECIAL_CHAR) && (!plugin || plugin === "help")) {
  require(`./nexss-help/help.js`);
  return;
}

// During development you can create package name as plugin which is not allowed.
if (
  fs.existsSync(`${NEXSS_SRC_PATH}/nexss-${plugin}/`) &&
  fs.existsSync(`${NEXSS_PACKAGES_PATH}/${plugin}`)
) {
  log.error("NEXSS DEVELOPER WARNING !");
  log.error(
    `THE PLUGIN ${NEXSS_SRC_PATH}/nexss-${plugin} colide with package ${NEXSS_PACKAGES_PATH}/${plugin}`
  );
  log.error(
    `There CANNOT be the same name for plugin and package. PLEASE CHANGE THE PACKAGE NAME!`
  );
  log.error(`Nexss Programmer will not continue until it is done.`);
  return;
}

let fileOrFolderExists;

const packageName = plugin.split("/")[0];

// Replacer so you can build shortcuts like P
if (process.aliases[plugin]) {
  plugin = process.aliases[plugin];
}

if (
  plugin.startsWith(NEXSS_SPECIAL_CHAR) ||
  fs.existsSync(plugin) ||
  isURL(plugin)
) {
  fileOrFolderExists = plugin;
  process.argv[2] = plugin;
  process.argv[1] = "start";
  plugin = "start";
} else if (
  fs.existsSync(`${NEXSS_PACKAGES_PATH}/${plugin}`) ||
  require("./nexss-package/repos.json")[packageName]
) {
  if (!fs.existsSync(`${NEXSS_PACKAGES_PATH}/${packageName}`)) {
    // Installs package if is not downloaded.
    const { installPackages } = require("./nexss-package/lib/install");
    installPackages(NEXSS_PACKAGES_PATH, packageName);
  }
  fileOrFolderExists = `${NEXSS_PACKAGES_PATH}/${plugin}`;
  process.argv[2] = `${NEXSS_PACKAGES_PATH}/${plugin}`;
  process.argv[1] = "start";
  plugin = "start";
} else if (!fs.existsSync(`${NEXSS_SRC_PATH}/nexss-${plugin}/nexssPlugin.js`)) {
  const { getLangByFilename } = require("./nexss-language/lib/language");

  // We check if thiscan be language specified action like
  // --> eg. nexss js install socketio
  const languageSelected = getLangByFilename(`example.${plugin}`, true);
  // To use lang specific commands use
  // `nexss js install OR nexss php install` NOT!-> nexss .js install
  if (plugin.split(".").length === 1 && languageSelected) {
    const { getCompiler } = require("./nexss-start/lib/start/compiler");
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
    pmArguments = pmArguments.filter((e) => e !== "--nocache");

    // INSTALL / UNINSTALL
    if (
      (process.argv[3] === "install" || process.argv[3] === "uninstall") &&
      (!process.argv[4] ||
        process.argv[4] === "--" ||
        process.argv[4] === "--nocache" ||
        process.argv[4] === "--debug")
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

        log.info(
          `installing ${yellow(bold(languageSelected.title))}, please wait..`
        );

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

        let config;
        const configPath = require("os").homedir() + "/.nexss/config.json";
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
                plugin
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
            if (config.languages && config.languages[plugin]) {
              console.log(
                `Default ${whatToSet.slice(0, -1)} is set to ${bold(
                  config.languages[plugin][whatToSet]
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
                plugin
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
            )}' does not exist. Use existing one eg  'nexss ${plugin} ${argument} compiler ${firstName}'`
          );
          if (Object.keys(languageSelected[whatToSet]).length) {
            console.log(bold(`List of ${whatToSet}:`));
            Object.keys(languageSelected[whatToSet]).forEach((w) => {
              console.log(bold(w), languageSelected[whatToSet][w]);
            });
          } else {
            log.warn(
              `No ${bold(whatToSet)} specified in the configuration for ${bold(
                plugin
              )}.`
            );
          }

          process.exit();
        }

        if (!config.languages[plugin]) {
          config.languages[plugin] = {};
        }

        if (toSet === "unset") {
          delete config.languages[plugin][whatToSet];
          toSet = Object.keys(languageSelected[whatToSet])[0];
        } else {
          config.languages[plugin][whatToSet] = toSet;
        }

        if (!languageSelected[whatToSet][toSet].switch) {
          languageSelected[whatToSet][toSet].switch = languageSelected[
            whatToSet
          ][toSet].install.replace(/install/g, "reset");
        }

        fs.writeFileSync(configPath, JSON.stringify(config));

        if (languageSelected[whatToSet][toSet]) {
          //Reseting to the version
          const command = `scoop bucket add versions && ${languageSelected[whatToSet][toSet].install} && ${languageSelected[whatToSet][toSet].switch}`;

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
          `${whatToSet} has been set for language ${plugin} ${argument} compiler ${toSet}'`
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

        const { getCompiler } = require("./nexss-start/lib/start/compiler");
        const compiler = getCompiler({
          path: "",
          name: `test${languageSelected.extensions[0]}`,
        });
        const { ensureInstalled } = require("./lib/terminal");
        ensureInstalled(compiler.command, compiler.install);

        const pmArguments = process.argv.slice(3);
        const command = `${compiler.command} ${pmArguments.join(" ")}`;
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
          console.log(`Running FUNCTION ${argument}(${cliArgs._.join(",")})`);
          action(...cliArgs._);
        } else {
          const pmArguments = process.argv.slice(4);
          const command = `${action} ${pmArguments.join(" ")}`;

          log.info(`Execute: ${bold(command)}, cwd: ${process.cwd()}`);

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
        }
      }
    } else {
      log.info(`No actions for '${plugin}'`);
    }
  } else {
    // File not found OR no actions can be performed

    console.log(
      `${bold(plugin)} has not been found. 
To add new file please use command ${bold("nexss file add " + plugin)}`
    );
    //
  }

  return;
}

//We check if command/plugin exists otherwise help.
// try {
//   require(`./nexss-${plugin}/nexssPlugin.js`);
// } catch (err) {
//   require(`./nexss-help/help.js`);
//   return;
// }

let command = cliArgs._[1] || undefined;

// Aliases for commands like nexss file [add] -> nexss file [a]
let commandAliases = {};
if (fs.existsSync(`${NEXSS_SRC_PATH}/nexss-${plugin}/aliases.json`)) {
  commandAliases = require(`${NEXSS_SRC_PATH}/nexss-${plugin}/aliases.json`);
  if (commandAliases[command]) {
    command = commandAliases[command];
  }
}

// Here loads when help is needed for particular command eg nexss file add help
if (process.argv[4] === "help") {
  //help for command
  try {
    const helpContent = fs.readFileSync(
      `${NEXSS_SRC_PATH}/nexss-${plugin}/commands/${command}.md`
    );
    console.info(helpContent.toString());
  } catch (error) {
    console.log(error);
    process.exit();
  }

  return;
}

if (fileOrFolderExists && process.argv[3] === "test") {
  //help for command
  process.chdir(fileOrFolderExists);

  const testName = process.argv.length > 3 ? process.argv[4] : null;
  if (!testName) {
    log.warn(`Enter test name or specify 'all' to run all tests`);
    process.exit(1);
  }
  const testCommand = `nexss test ${testName}`;

  try {
    child_process.execSync(testCommand, {
      stdio: "inherit",
      detached: false,
      shell: process.shell,
      maxBuffer: 1024 * 1024 * 100,
    });
  } catch (error) {
    console.log(`Command failed ${testCommand}`);
  }
  return;
}

switch (command) {
  case "help":
    try {
      // Plugin hel
      if (fileOrFolderExists) {
        if (fs.existsSync(`${fileOrFolderExists}/README.md`)) {
          const helpContent = fs.readFileSync(
            `${fileOrFolderExists}/README.md`
          );
          console.info(helpContent.toString());
        } else {
          const { extname } = require("path");
          const f = fs.readdirSync(`${fileOrFolderExists}/`);
          f.filter(
            (e) => [".json", ".git"].indexOf(extname(e)) !== 0
          ).forEach((e) => (e !== ".git" ? console.log(`${e}`) : ""));
        }

        return;
      }

      const helpContent = fs.readFileSync(
        `${NEXSS_SRC_PATH}/nexss-${plugin}/help.md`
      );
      console.info(helpContent.toString());
    } catch (error) {
      console.log(error);
      log.error(`Long help is not found for plugin nexss-${plugin}`);
    }
    break;

  default:
    try {
      if (
        !fileOrFolderExists &&
        command &&
        plugin !== "command" &&
        plugin !== "test" &&
        plugin !== "edit"
      ) {
        if (
          fs.existsSync(
            `${NEXSS_SRC_PATH}/nexss-${plugin}/commands/${command}.js`
          )
        ) {
          require(`./nexss-${plugin}/commands/${command}.js`);
        } else {
          log.error(
            `Command ${bold(command)} has not been found for nexss-${bold(
              plugin
            )}.`
          );
        }
      } else {
        //We check if there is command with the same name as plugin to run it
        if (
          fs.existsSync(
            `${NEXSS_SRC_PATH}/nexss-${plugin}/commands/${plugin}.js`
          )
        ) {
          // log.d(
          //   yellow(`Loading plugin.. ./nexss-${plugin}/commands/${plugin}.js`)
          // );
          require(`./nexss-${plugin}/commands/${plugin}.js`);
        } else {
          let helpContent = fs.readFileSync(
            `${NEXSS_SRC_PATH}/nexss-${plugin}/help.md`
          );

          // console.log(`./nexss-${plugin}/commands/*.md`);
          const fg = require("fast-glob");
          const files = fg.sync([
            `${__dirname}/nexss-${plugin}/commands/*.md`.replace(/\\/g, "/"),
          ]);
          const { basename } = require("path");
          let filesList = files.map((f) => basename(f).replace(".md", ""));
          helpContent += `${bold("Commands available")} for nexss-${bold(
            plugin
          )}
${bold(filesList.join(", "))}
example to display help 'nexss ${plugin} ${filesList[0]} help'`;
          // console.log(filesList);
          // files.forEach(
          //   f =>
          //     (helpContent +=
          //       require("fs").readFileSync(f) +
          //       "-----------------------------\n")
          // );
          console.info(helpContent.toString());
        }
      }

      // if (!cmd.default) {
      //   throw yellow(`Command ${command} is not implemented.`);
      // }
      // cmd.default();
    } catch (err) {
      log.error(err);
      console.log(err);
      // console.log(process.cwd());
      // const helpContent = fs.readFileSync(
      //   `${NEXSS_SRC_PATH}/nexss-${plugin}/help.md`
      // );
      // console.info(helpContent.toString());
    }
    break;
}
