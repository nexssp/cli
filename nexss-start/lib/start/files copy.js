const path = require("path");
const fs = require("fs");
const { loadConfigContent } = require("../../../lib/config");
const dotenv = require("dotenv");
const { bold, red, green, blue } = require("@nexssp/ansi");
const { NEXSS_SPECIAL_CHAR } = require("../../../config/defaults");
const { getSequence } = require("./sequence");
require("../../../lib/arrays"); // array flat / nodejs 10
const assert = require("assert");
const loadEnv = (p) => {
  if (!p) {
    p = `./config.env`;
  }

  if (fs.existsSync(p)) {
    return dotenv.parse(fs.readFileSync(p));
  }
};
var { parseArgsStringToArgv } = require("string-argv");
const parseName = (name, incl) => {
  const arr = parseArgsStringToArgv(name);
  let result = []; // was {} ??
  if (incl) result.name = arr[0];
  if (arr.length > 1) {
    result.args = arr.slice(1);
  }
  return result;
};

const getName = (name) => name && name.split(" ")[0];

function getPath(fileOrFolder) {
  let resultPath;
  if (fs.existsSync(fileOrFolder)) {
    resultPath = path.resolve(fileOrFolder);
    if (
      !(process.nxsErrors && process.nxsErrors[fileOrFolder]) &&
      fileOrFolder !== "." &&
      fs.existsSync(`${process.env.NEXSS_PACKAGES_PATH}/${fileOrFolder}`)
    ) {
      if (process.cwd() !== process.env.NEXSS_PACKAGES_PATH) {
        console.error(
          bold(
            `Warning: You have folder on your project: ${fileOrFolder}. 
There is also Nexss Programmer package name called with the same. 
If this is overwrite of standard Nexss Programmer 
package then it is ok, otherwise use different name.`
          )
        );
      }

      if (!process.nxsErrors) process.nxsErrors = {};
      process.nxsErrors[fileOrFolder] = true;
    }
  } else if (
    fs.existsSync(`${process.env.NEXSS_PACKAGES_PATH}/${fileOrFolder}`)
  ) {
    resultPath = `${process.env.NEXSS_PACKAGES_PATH}/${fileOrFolder}`;
  }
  return resultPath;
}
const { isURL } = require("../../../lib/data/url");
// Move later to separate file, The same is in the nexssFileParser.js
function stripEndQuotes(s) {
  return s.replace && s.replace(/(^["|'])|(["|']$)/g, "");
}

const { inspect } = require("util");

const getFiles = (folder, args, env, ccc) => {
  // log.di(`getFiles: `, inspect(folder).replace(/\n/g, " "));
  assert(folder, "missing path");
  const command = folder.name;

  if (folder.name.startsWith("//")) {
    return;
  }
  const cwd = path.resolve(process.cwd());

  let ArgsParsed = parseName(folder.name).args;
  if (ArgsParsed) {
    ArgsParsed = require("minimist")(ArgsParsed); //convert to object
  }
  if (ArgsParsed) {
    for (let [key, value] of Object.entries(ArgsParsed)) {
      if (!Array.isArray(value)) {
        if (isNaN(value)) {
          ArgsParsed[key] = stripEndQuotes(value);
        }
      } else {
        ArgsParsed[key] = ArgsParsed[key].map((a) => {
          return stripEndQuotes(a);
        });
      }
    }
  }

  if (!args) {
    args = ArgsParsed;
  } else {
    Object.assign(args, ArgsParsed);
  }
  if (args) {
    if (args._ && args._.length === 0) {
      delete args._;
    } else {
      if (!args.nxsIn || args._) {
        if (args._) args.nxsIn = args._;
        delete args._;
      }
    }

    if (Object.keys(args).length === 0) {
      // TODO: This needs to be checked in the refactoring stage. for now this "wonderful"
      args = [];
    }
  }
  // console.log("folder:", folder, "ARGS!!!!!!!!!!", args);

  // const { isURL } = require("../../lib/url");

  if (isURL(folder.name)) {
    if (folder.name.startsWith("http")) {
      return folder;
    }
  }

  let folderAbsolute = getPath(getName(folder.name));
  // Each package can have platform dependent code. For example
  // IF in the Id package is folder Linux, it will be run instead of main
  // You can use symlinks to make it more DRY
  if (folderAbsolute) {
    const platformDependedPath = path.join(folderAbsolute, process.platform);
    if (fs.existsSync(platformDependedPath)) {
      folderAbsolute = platformDependedPath;
    }
  }

  if (!folderAbsolute && folder.name !== NEXSS_SPECIAL_CHAR) {
    if (!folder.filename) {
      // TODO: Maybe later to add here extra/special functions like:
      // nexss $#abc, then folder.name = $#abc
      // see --update function (/lib/core/update.js)
      return folder;
    }
    folderAbsolute = path.resolve(folder.filename);
    // console.log("RESOLVED!!!", folderAbsolute);
  }

  // console.log("folder absolute========================", folderAbsolute);

  // const currentFolder = path.dirname(folder.filename);
  // process.chdir(folder.path);

  // console.log(`CF: ${process.cwd()}, folder abs: ${folderAbsolute}`);
  // .nexss language
  if (
    !folder.name.startsWith(NEXSS_SPECIAL_CHAR) &&
    !fs.existsSync(folderAbsolute)
  ) {
    console.error(
      `${red("Error: ")} There is an error on file ${bold(
        folder.filename.replace(".\\", "")
      )} line: ${folder.lineNumber} ${bold(folder.name)} does not exist.`
    );

    process.exit(0);
  }
  // This is $# commands
  if (folder.name.startsWith(NEXSS_SPECIAL_CHAR)) {
    folder.args = args;
    // folder.env = env;
    return folder;
  }

  if (fs.lstatSync(folderAbsolute).isFile()) {
    let res = Object.assign(folder, parseName(folder.name, true));
    res.path = cwd;
    if (env) {
      res.env = env;
    } else {
      const loaded = loadEnv();
      if (loaded) {
        res.env = loaded;
      }
    }
    res.commmand = folderAbsolute;
    return res;
  }

  // console.log("folderAbsolute:", folderAbsolute);
  process.chdir(folderAbsolute);
  const config = loadConfigContent(folderAbsolute + "/_nexss.yml");

  let envLoaded = loadEnv();
  if (envLoaded) {
    env = envLoaded;
  }
  let config_files;
  if (!config) {
    log.warn(
      `No config file in ${path.normalize(
        folderAbsolute
      )} the the searching.. for index.nexss OR start.nexss `
    );
    // if there is one file and it is called index

    const startFile = fs
      .readdirSync(folderAbsolute)
      .filter(
        (startFile) =>
          startFile === "index.nexss" || startFile === "start.nexss"
      );
    if (startFile) {
      config_files = [{ name: startFile[0] }];
    } else {
      log.error(
        "No config file in the searching for index.nexss ",
        path.normalize(folderAbsolute)
      );
      process.exit(1);
    }
  } else {
    config_files = getSequence(folder.seq, config);
  }
  let counter = config_files ? config_files.length : 0;

  if (!Array.isArray(config_files)) {
    console.error(
      bold(`You need to have files: or 'default' sequence to run project.`) +
        bold("\nfiles") +
        " needs to be an array. \nMaybe you need to add " +
        red("-") +
        " at the front of the name in the _nexss.yml config file eg.\n" +
        green(bold("files:\n  - name: myfile.js")) +
        blue(
          `\nmore here: ${bold("https://github.com/nexssp/cli/wiki/Config")}`
        )
    );
    process.exit(0);
  }

  const resultFiles =
    config_files &&
    config_files.map((file) => {
      if (!file.name) {
        return [];
      }

      // URL Address
      if (file.name.startsWith("http")) {
        const name = file.name;
        const split = file.name.trim().split(" ");
        file.name = split.shift();
        if (split.length > 0) {
          file.args = split;
        }
        return file;
      }

      const fileCWD = process.cwd();
      const ppp = getPath(getName(file.name));

      if (!ppp) {
        if (!file.name) {
          console.error(`'name' parameter not found in`, file);
          process.exit();
        }
        const folder = path.normalize(path.join(fileCWD, getName(file.name)));
        console.error(`${bold(folder)} does not exist.`);
        process.exit();
      }

      // This is a directory
      if (fs.lstatSync(ppp).isDirectory()) {
        //   //console.log("DIIIIIIIIIIIIIIIRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
        process.chdir(ppp);
        const subConfig = loadConfigContent(ppp + "/_nexss.yml");
        // console.log("config:", config);
        let envLoaded = loadEnv();
        if (envLoaded) {
          env = envLoaded;
        }
        process.chdir(fileCWD);
        let xxxx = getFiles(file, file.data, env, subConfig);
        return xxxx;
      }
      // } else {
      // We add input from the module at start of queue of this module
      if (config && counter-- === config_files.length) {
        if (config.input) {
          file.input = config.input;
        }
      }

      // We add output from the module at end of queue of this module
      if (config && counter === 0) {
        if (config.output) {
          file.output = config.output;
        }
      }

      if (config.errors) {
        file.errors = config.errors;
      }

      file.path = process.cwd();
      if (ccc && ccc.data && file.data) {
        // console.log("file.data, ccc.data", file.data, ccc.data);
        Object.assign(file.data, ccc.data);
      }

      if (config && config.data) {
        if (Array.isArray(config.data)) {
          console.error(
            `config.data is an Array. Do not use array for 'data' section in config file.`
          );
          const errorConfig = JSON.stringify(config, null, 2);
          console.error(errorConfig.replace(/\"data\"\:/, bold('"data:"')));
          console.error(
            bold(
              `Example of the correct config file here: https://github.com/nexssp/cli/wiki/Config`
            )
          );
          process.exit(0);
        }
        // console.log("file.data, config.data", file.data, config.data);

        file.data = Object.assign(file.data || {}, config.data);
      }
      if (ccc && ccc.debug) file.debug = ccc.debug;

      const arr = parseName(file.name);

      if (counter == 0) {
        // params from package only of first submodule,file as they are passed.

        file = Object.assign(file, { args });
      }

      if (Object.keys(arr).length > 0) {
        file.name = file.name.split(" ")[0];
        if (file.args) {
          try {
            file.args = file.args.concat(arr.args);
          } catch (e) {
            log.error(
              "There is an error in concatenation of file arguments. (nexss-start/lib/start/files.js)"
            );
            console.error("file.args is not an Array!");
            console.error("file.args", file.args, "arr.args", arr.args);
            process.exit(1);
          }
        } else {
          file.args = arr.args;
        }
        var unique = new Set(file.args);
        file.args = [...unique];
      }

      if (env) {
        file.env = env;
      }
      // ?????? process.chdir(cwd);
      // console.log(file);
      file.command = command;
      return file;
      //}
    });

  process.chdir(cwd);

  if (cliArgs.nxsDryFiles) {
    log.dm(bold("➤ Function enabled: --nxsDryFiles"));
    console.log(JSON.stringify(resultFiles && resultFiles.flat(), null, 2));
    process.exit(0);
  }

  return resultFiles && resultFiles.flat();
};

module.exports = { getFiles };