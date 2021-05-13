#!/usr/bin/env node
/*
 * Title: Nexss Programmer CLI
 * Author: Marcin Polak / nexss.com
 * 2018/10/01 initial version
 */

require("./nexss-core/init.js");
require("@nexssp/extend")("array");

log.dc(bold("∞ Starting Nexss Programmer.."));

// if (process.platform !== "Windows") {
//   process.argv = process.argv.argStripQuotes();
// }

nConst("hasStdin", cliArgs[nexss[":i"]]);

const NEXSS_SRC_PATH = process.env.NEXSS_SRC_PATH;
const NEXSS_PACKAGES_PATH = process.env.NEXSS_PACKAGES_PATH;
if (!cliArgs[nexss["process:title"]]) {
  process.title = `nexss (${NEXSSP_VERSION}:${process.pid}) ${process.argv
    .slice(2)
    .join(" ")}`;
} else {
  process.title = cliArgs[nexss["process:title"]];
  delete cliArgs[nexss["process:title"]];
}

log.d("⊛ Set the process title: ", process.title);

if (process.argv[2] && process.argv[2].startsWith("-")) {
  require("./nexss-core/-functions");
}

// Get first parameter as plugin name.
let plugin = cliArgs._[0];
if (plugin) {
  plugin += ""; // can be a number..
  const aliases = require("./aliases.json");

  if (aliases[plugin]) {
    plugin = aliases[plugin];
  }
} else {
  plugin = "$#";
}

// Aliases eg start -> s. Each package has also own aliases for commands.
// TO IMPLEMENT, NEW FEATURE: Aliases per project, per folder

// display main help eg: nexss help
if (!startWithSpecialChar(plugin) && (!plugin || plugin === "help")) {
  require(`./nexss-help/help.js`);
  return;
}

// During development you can create package name as plugin which is not allowed.
require("./nexss-dev").checkValidPluginName(plugin);

let fileOrFolderExists;

// Replacer so you can build shortcuts like P
if (process.aliases[plugin]) {
  plugin = process.aliases[plugin];
}

const { isURL } = require("./lib/data/url");

const packageName = plugin.split("/")[0];

if (startWithSpecialChar(plugin) || fs.existsSync(plugin) || isURL(plugin)) {
  fileOrFolderExists = plugin;
  cliArgs._.shift();
  cliArgs._.unshift("start", plugin);
  plugin = "start";
} else if (
  fs.existsSync(`${NEXSS_PACKAGES_PATH}/${plugin}`) ||
  require("./nexss-package/repos.json")[packageName]
) {
  // Install Package if not exists
  if (!fs.existsSync(`${NEXSS_PACKAGES_PATH}/${packageName}`)) {
    // Installs package if is not downloaded.
    const { installPackages } = require("./nexss-package/lib/install");
    installPackages(NEXSS_PACKAGES_PATH, packageName);
  }
  fileOrFolderExists = `${NEXSS_PACKAGES_PATH}/${plugin}`;
  cliArgs._.shift();
  cliArgs._.unshift("start", `${NEXSS_PACKAGES_PATH}/${plugin}`);
  plugin = "start";
} else if (!fs.existsSync(`${NEXSS_SRC_PATH}/nexss-${plugin}/nexssPlugin.js`)) {
  const { perLanguage } = require("./nexss-language/lib/perLanguage");
  perLanguage(plugin);
  return;
}

let command = cliArgs._[1] || undefined;

// Aliases for commands like nexss file [add] -> nexss file [a]
let commandAliases = {};
if (fs.existsSync(`${NEXSS_SRC_PATH}/nexss-${plugin}/aliases.json`)) {
  commandAliases = require(`${NEXSS_SRC_PATH}/nexss-${plugin}/aliases.json`);
  if (commandAliases[command]) {
    command = commandAliases[command];
  }
}

// Here loads when help is needed for particular command eg nexss file add help for 'file add'
if (cliArgs._[2] === "help" && command) {
  //help for command

  if (!path.isAbsolute(command)) {
    const helpFile = `${NEXSS_SRC_PATH}/nexss-${plugin}/commands/${command}.md`;
    try {
      if (fs.existsSync(helpFile)) {
        const helpContent = fs.readFileSync(helpFile);
        require("./nexss-core/markdown").displayMarkdown(
          helpContent.toString()
        );
      } else {
        console.log(`file ${helpFile} not found.`);
      }
    } catch (error) {
      console.log(error);
      process.exit();
    }
  } else {
    if (fileOrFolderExists) {
      if (fs.existsSync(`${fileOrFolderExists}/README.md`)) {
        const helpContent = fs.readFileSync(`${fileOrFolderExists}/README.md`);

        require("./nexss-core/markdown").displayMarkdown(
          helpContent.toString()
        );
      } else {
        const { extname } = require("path");
        if (fs.existsSync(fileOrFolderExists)) {
          const f = fs.readdirSync(`${fileOrFolderExists}/`);
          f.filter(
            (e) => [".json", ".git", ".gitignore"].indexOf(extname(e)) !== 0
          ).forEach((e) => (e !== ".git" ? console.log(`${e}`) : ""));
        } else {
          console.log(`${fileOrFolderExists} has not been found.`);
        }
      }

      return;
    }

    const helpContent = fs.readFileSync(
      `${NEXSS_SRC_PATH}/nexss-${plugin}/help.md`
    );
    require("./nexss-core/markdown").displayMarkdown(helpContent.toString());
  }

  return;
}

// TODO: New testing system to implement. Now working for the Nexss Programmer, not packages.
// TODO: Use older version of Nexss Programmer 2.3.x-
if (fileOrFolderExists && cliArgs._[0] === "test") {
  //help for command
  process.chdir(fileOrFolderExists);

  const testName = process.argv.length > 2 ? process.argv[3] : null;
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

try {
  if (
    command !== "help" &&
    !fileOrFolderExists &&
    command &&
    !["command", "test", "edit"].includes(plugin)
  ) {
    if (
      fs.existsSync(`${NEXSS_SRC_PATH}/nexss-${plugin}/commands/${command}.js`)
    ) {
      require(`./nexss-${plugin}/commands/${command}.js`);
    } else {
      log.error(
        `Command ${bold(command)} has not been found for nexss-${bold(plugin)}.`
      );
    }
  } else {
    // First we check if the command exists
    if (
      fs.existsSync(`${NEXSS_SRC_PATH}/nexss-${plugin}/commands/${plugin}.js`)
    ) {
      require(`./nexss-${plugin}/commands/${plugin}.js`);
    } else {
      let helpContent = "";
      try {
        helpContent = fs.readFileSync(
          `${NEXSS_SRC_PATH}/nexss-${plugin}/help.md`
        );
      } catch (e) {
        log.error(
          `File ${helpContent} has not been found. This maybe the issue that you have installed different versions of Nexss Programmer. Try use --nocache option to recreate cache.`
        );
        process.exit(1);
      }
      const fg = require("fast-glob");
      const files = fg.sync(
        [`${__dirname}/nexss-${plugin}/commands/*.md`.replace(/\\/g, "/")],
        { ignore: ["!*/**/*.nexss-test.js"] }
      );
      const { basename } = require("path");
      let filesList = files.map((f) => basename(f).replace(".md", ""));
      helpContent += `${bold("Commands available")} for nexss-${bold(plugin)}

${bold(filesList.join(", "))}
example to display help 'nexss ${plugin} ${filesList[0]} help'`;
      require("./nexss-core/markdown").displayMarkdown(helpContent.toString());
    }
  }
} catch (err) {
  log.error(err);
  console.log(err);
}
