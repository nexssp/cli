#!/usr/bin/env node

/*
 * Title: Nexss CLI
 * Description: Nexss CLI with plugin and help fw
 * Author: Marcin Polak
 * 2018/10/01 initial version
 */

const { bold } = require("./lib/color");
const { NEXSS_SRC_PATH, NEXSS_PACKAGES_PATH } = require("./config/config");
const { error, info, ok, warn } = require("./lib/log");
const { existsSync } = require("fs");
const { isURL } = require("./lib/data/url");

const cliArgs = require("minimist")(process.argv.slice(2));

if (cliArgs.version) {
  console.log(require("./package.json").version);
  process.exit(0);
}

let plugin = cliArgs._[0];

const aliases = require("./aliases.json");

if (aliases[plugin]) {
  plugin = aliases[plugin];
}

if (!plugin || plugin === "help") {
  require(`./nexss-help/help.js`);
  return;
}

if (
  existsSync(`${NEXSS_SRC_PATH}/nexss-${plugin}/`) &&
  existsSync(`${NEXSS_PACKAGES_PATH}/${plugin}`)
) {
  error("NEXSS DEVELOPER WARNING !");
  error(
    `THE PLUGIN ${NEXSS_SRC_PATH}/nexss-${plugin} colide with package ${NEXSS_PACKAGES_PATH}/${plugin}`
  );
  error(
    `There CANNOT be the same name for plugin and package. PLEASE CHANGE THE PACKAGE NAME!`
  );
  error(`Nexss Programmer will not continue until it is done.`);
  process.exit(1);
}

//we check if first parameter is folder or plugin

// We check if this is direct folder passed.
// console.log(`${NEXSS_PACKAGES_PATH}/${plugin}`);
let fileOrFolderExists;
if (existsSync(plugin) || isURL(plugin)) {
  fileOrFolderExists = plugin;
  process.argv[2] = plugin;
  process.argv[1] = "start";
  plugin = "start";
} else if (existsSync(`${NEXSS_PACKAGES_PATH}/${plugin}`)) {
  // cliArgs._[2] = `${NEXSS_PACKAGES_PATH}/${plugin}`;
  fileOrFolderExists = `${NEXSS_PACKAGES_PATH}/${plugin}`;
  process.argv[2] = `${NEXSS_PACKAGES_PATH}/${plugin}`;
  process.argv[1] = "start";
  plugin = "start";
} else {
  // FIXME: file system issue here ? TO REVIEW
  if (!existsSync(`${NEXSS_SRC_PATH}/nexss-${plugin}/nexssPlugin.js`)) {
    const { getLangByFilename } = require("./nexss-language/lib/language");
    // We check if thiscan be language specified action like
    // --> eg. nexss js install socketio
    const languageSelected = getLangByFilename(`example.${plugin}`, true);
    // To use lang specific commands use
    // `nexss js install OR nexss php install` NOT!-> nexss .js install
    if (plugin.split(".").length === 1 && languageSelected) {
      const pm =
        languageSelected.languagePackageManagers[
          Object.keys(languageSelected.languagePackageManagers)[0]
        ];

      cliArgs._.shift();
      const argument = cliArgs._.shift();
      // console.log(argument);

      // custom actions like display compilers etc
      // eg nexss js compilers, nexss js builders

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
                error(`You cannot specify ${whatToSet}.`);
              } else {
                error(`What you want to change?`);
              }

              error(`Use ${bold("compiler, builder, packageManager or pm")}`);

              process.exit();
              break;
          }

          let config;
          const configPath = require("os").homedir() + "/.nexss/config.json";
          if (require("fs").existsSync(configPath)) {
            config = require(configPath);
          } else {
            config = { languages: {} };
          }

          const firstName = Object.keys(languageSelected[whatToSet])[0];
          if (!toSet) {
            if (Object.keys(languageSelected[whatToSet]).length) {
              error(
                `Specify '${bold(whatToSet)}' name to set eg: nexss '${bold(
                  plugin
                )} ${argument} compiler ${bold(firstName)}'`
              );

              console.log(bold(`List of ${whatToSet}:`));
              let firstCompiler;
              Object.keys(languageSelected[whatToSet]).forEach(w => {
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
              warn(
                `No ${bold(
                  whatToSet
                )} specified in the configuration for ${bold(plugin)}.`
              );
            }

            process.exit();
          }

          if (
            !languageSelected[whatToSet][toSet] &&
            toSet.toLowerCase() !== "unset"
          ) {
            error(
              `Compiler '${bold(
                toSet
              )}' does not exist. Use existing one eg  'nexss ${plugin} ${argument} compiler ${firstName}'`
            );
            if (Object.keys(languageSelected[whatToSet]).length) {
              console.log(bold(`List of ${whatToSet}:`));
              Object.keys(languageSelected[whatToSet]).forEach(w => {
                console.log(bold(w), languageSelected[whatToSet][w]);
              });
            } else {
              warn(
                `No ${bold(
                  whatToSet
                )} specified in the configuration for ${bold(plugin)}.`
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

          require("fs").writeFileSync(configPath, JSON.stringify(config));

          if (languageSelected[whatToSet][toSet]) {
            //Reseting to the version
            const command = `scoop bucket add versions && ${languageSelected[whatToSet][toSet].install} && ${languageSelected[whatToSet][toSet].switch}`;

            try {
              require("child_process").execSync(command, {
                stdio: "inherit",
                detached: false,
                shell: true,
                cwd: process.cwd()
              });
            } catch (error) {
              console.log(
                `Command failed ${languageSelected[whatToSet][toSet].switch}`
              );
            }
          }

          ok(
            `${whatToSet} has been set for language ${plugin} ${argument} compiler ${toSet}'`
          );

          process.exit(0);
          break;
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
            configFile: languageSelected.configFile
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

      console.log(`Language selected: ${bold(languageSelected.title)}`);

      if (pm) {
        const action = pm[argument];

        if (!action) {
          console.log(
            `Select Action.`,
            Object.keys(pm)
              .concat(["info", "config"])
              .filter(
                e =>
                  !["keyOfItem", "else", "messageAfterInstallation"].includes(e)
              )
          );
          process.exit();
        } else {
          if (Object.prototype.toString.call(action) === `[object Function]`) {
            console.log(`Running FUNCTION ${argument}(${cliArgs._.join(",")})`);
            action(...cliArgs._);
          } else {
            const pmArguments = process.argv.slice(4);
            const command = `${action} ${pmArguments.join(" ")}`;

            info(`Execute: ${bold(command)}, cwd: ${process.cwd()}`);

            try {
              require("child_process").execSync(command, {
                stdio: "inherit",
                detached: false,
                shell: true,
                cwd: process.cwd()
              });
            } catch (error) {
              console.log(`Command failed ${command}`);
            }
          }
        }
      } else {
        info(`No actions for '${plugin}'`);
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
}

//We check if command/plugin exists otherwise help.
try {
  require(`./nexss-${plugin}/nexssPlugin.js`);
} catch (err) {
  require(`./nexss-help/help.js`);
  return;
}

let command = cliArgs._[1] || undefined;

let commandAliases = {};
if (existsSync(`${NEXSS_SRC_PATH}/nexss-${plugin}/aliases.json`)) {
  commandAliases = require(`${NEXSS_SRC_PATH}/nexss-${plugin}/aliases.json`);
  if (commandAliases[command]) {
    command = commandAliases[command];
  }
}

// Here loads when help is needed for particular command eg nexss file add help
if (process.argv[4] === "help") {
  //help for command
  try {
    const helpContent = require("fs").readFileSync(
      `${NEXSS_SRC_PATH}/nexss-${plugin}/commands/${command}.md`
    );
    console.info(helpContent.toString());
  } catch (error) {
    console.log(error);
    process.exit();
  }

  return;
}

switch (command) {
  case "help":
    try {
      // Plugin hel
      if (fileOrFolderExists) {
        const fs = require("fs");
        if (fs.existsSync(`${fileOrFolderExists}/README.md`)) {
          const helpContent = require("fs").readFileSync(
            `${fileOrFolderExists}/README.md`
          );
          console.info(helpContent.toString());
        } else {
          const f = fs.readdirSync(`${fileOrFolderExists}/`);
          f.forEach(e => console.log(`${e}`));
        }

        return;
      }

      const helpContent = require("fs").readFileSync(
        `${NEXSS_SRC_PATH}/nexss-${plugin}/help.md`
      );
      console.info(helpContent.toString());
    } catch (error) {
      console.log(error);
      console.error(`Long help is not found for plugin nexss-${plugin}`);
    }
    break;

  default:
    try {
      if (
        !fileOrFolderExists &&
        command &&
        plugin !== "command" &&
        plugin !== "test"
      ) {
        if (
          require("fs").existsSync(
            `${NEXSS_SRC_PATH}/nexss-${plugin}/commands/${command}.js`
          )
        ) {
          require(`./nexss-${plugin}/commands/${command}.js`);
        } else {
          error(
            `Command ${bold(command)} has not been found for nexss-${bold(
              plugin
            )}.`
          );
        }
      } else {
        //We check if there is command with the same name as plugin to run it
        if (
          existsSync(`${NEXSS_SRC_PATH}/nexss-${plugin}/commands/${plugin}.js`)
        ) {
          require(`./nexss-${plugin}/commands/${plugin}.js`);
        } else {
          let helpContent = require("fs").readFileSync(
            `${NEXSS_SRC_PATH}/nexss-${plugin}/help.md`
          );
          // console.log(`./nexss-${plugin}/commands/*.md`);
          const fg = require("fast-glob");
          const files = fg.sync([
            `${__dirname}/nexss-${plugin}/commands/*.md`.replace(/\\/g, "/")
          ]);
          const { basename } = require("path");
          let filesList = files.map(f => basename(f).replace(".md", ""));
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
      console.error(err);
      // console.log(process.cwd());
      const helpContent = require("fs").readFileSync(
        `${NEXSS_SRC_PATH}/nexss-${plugin}/help.md`
      );
      console.info(helpContent.toString());
    }
    break;
}
