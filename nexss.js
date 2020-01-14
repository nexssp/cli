#!/usr/bin/env node
/*
 * Title: Nexss CLI
 * Description: Nexss CLI with plugin and help fw
 * Author: Marcin Polak
 * 2018/10/01 initial version
 */

const { blue, bold } = require("./lib/color");
const { NEXSS_SRC_PATH, NEXSS_PACKAGES_PATH } = require("./config/config");
const { error, info, warn } = require("./lib/log");
const { existsSync } = require("fs");
const { isURL } = require("./lib/data/url");

const cliArgs = require("minimist")(process.argv.slice(2));

let plugin = cliArgs._[0];

const aliases = require("./aliases.json");

if (aliases[plugin]) {
  plugin = aliases[plugin];
}

if (!plugin || plugin === "help") {
  require(`./nexss-help/help.js`);
  return;
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

    const languageSelected = getLangByFilename(`example.${plugin}`);
    // To use lang specific commands use
    // `nexss js install OR nexss php install` NOT!-> nexss .js install
    if (plugin.split(".").length === 1 && languageSelected) {
      const pm = languageSelected.getFirst("languagePackageManagers");
      cliArgs._.shift();
      const argument = cliArgs._.shift();
      // console.log(argument);

      // custom actions like display compilers etc
      // eg nexss js compilers, nexss js builders
      switch (argument) {
        case "compilers":
          console.log(languageSelected.compilers);
          process.exit(0);
          break;
        case "builders":
          console.log(languageSelected.builders);
          process.exit(0);
          break;
        case "errors":
          console.log(languageSelected.errors);
          process.exit(0);
          break;
        case "pm":
        case "packageManagers":
          console.log(languageSelected.languagePackageManagers);
          process.exit(0);
          break;
        default:
          break;
      }

      console.log(`Language selected: ${languageSelected.title}`);

      if (pm) {
        const action = pm[argument];

        if (!action) {
          console.log(
            `Select Action.`,
            Object.keys(pm).filter(
              e =>
                !["keyOfItem", "else", "messageAfterInstallation"].includes(e)
            )
          );
          process.exit(1);
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
}

if (commandAliases[command]) {
  command = commandAliases[command];
}
// Here loads when help is needed for particular command eg nexss file add help
if (process.argv[4] === "help") {
  //help for command
  try {
    const helpContent = require("fs").readFileSync(
      `${NEXSS_SRC_PATH}/nexss-${plugin}/commands/${command}.md`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  console.info(helpContent.toString());
  return;
}

switch (command) {
  case "help":
    try {
      if (fileOrFolderExists) {
        // console.log(fileOrFolderExists, "WWWWWWWWWWWWWWWWWWWWWWWWWW");
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
      // each command needs to have module.exports.default function
      // console.log(
      //   "zzzzzzzzzzzzzzzzzzz",
      //   `./nexss-${plugin}/commands/${command}.js`
      // );
      // console.log(command && plugin !== "command", command, plugin);

      if (!fileOrFolderExists && command && plugin !== "command") {
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
${blue(filesList.join(", "))}
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
