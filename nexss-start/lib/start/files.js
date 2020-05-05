const path = require("path");
const fs = require("fs");
const { loadConfigContent } = require("../../../lib/config");
const dotenv = require("dotenv");
const { bold, red } = require("../../../lib/color");
const { NEXSS_SPECIAL_CHAR } = require("../../../config/defaults");

const loadEnv = (p) => {
  if (!p) {
    p = `./config.env`;
  }

  if (fs.existsSync(p)) {
    return dotenv.parse(fs.readFileSync(p));
  }
};

const parseName = (name, incl) => {
  const arr = name.split(" ");
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
      fileOrFolder !== "." &&
      fs.existsSync(`${process.env.NEXSS_PACKAGES_PATH}/${fileOrFolder}`)
    ) {
      console.error(
        bold(
          `NOTE: You have folder on your project: ${fileOrFolder}. There is also package name called with the same. If this is overwrite of standard Nexss Programmer package is ok, otherwise use different name.`
        )
      );
    }
  } else if (
    fs.existsSync(`${process.env.NEXSS_PACKAGES_PATH}/${fileOrFolder}`)
  ) {
    resultPath = `${process.env.NEXSS_PACKAGES_PATH}/${fileOrFolder}`;
  }
  return resultPath;
}
const { isURL } = require("../../../lib/data/url");

const getFiles = (folder, args, env, ccc) => {
  //We ommit comments
  // console.log("GET FILES START: ", folder);
  if (folder.name.startsWith("//")) {
    return;
  }
  const cwd = path.resolve(process.cwd());
  if (!args) {
    args = parseName(folder.name);
  }
  // const { isURL } = require("../../lib/url");

  if (isURL(folder.name)) {
    if (folder.name.startsWith("http")) {
      return folder;
    }
  }

  let folderAbsolute = getPath(getName(folder.name));
  if (!folderAbsolute && folder.name !== NEXSS_SPECIAL_CHAR) {
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

    return res;
  }
  // console.log("folderAbsolute:", folderAbsolute);
  process.chdir(folderAbsolute);
  const config = loadConfigContent(folderAbsolute + "/_nexss.yml");
  // console.log("config:", config);
  let envLoaded = loadEnv();
  if (envLoaded) {
    env = envLoaded;
  }

  if (!config) {
    console.error("No config file in the ", path.normalize(folderAbsolute));
    console.error("Error item: ");
    console.error(folder);
    console.error("Args: ");
    console.error(args);
    // console.error("Env: ");
    // console.error(env);
    process.exit(0);
  }

  let counter = config.files ? config.files.length : 0;

  const resultFiles =
    config.files &&
    config.files.map((file) => {
      const fileCWD = process.cwd();
      // console.log("=============================================");
      // console.log("FFFFFIIILLLLEEEEEEEEEE->", file, "fileCWD:", fileCWD);

      const ppp = getPath(getName(file.name));
      // console.log("=============================================");

      // console.log("ppp", ppp, "file:", file);

      if (!ppp) {
        if (!file.name) {
          console.error(`'name' parameter not found in`, file);
          process.exit();
        }
        const folder = path.normalize(path.join(fileCWD, getName(file.name)));
        console.error(`${bold(folder)} does not exist.`);
        process.exit();
      }

      // if (!fs.lstatSync(ppp).isDirectory()) {
      //   //console.log("DIIIIIIIIIIIIIIIRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
      //   process.chdir(ppp);
      //   // console.log(
      //   //   "----------------------------------------------file:",
      //   //   file,
      //   //   "----ppp:",
      //   //   ppp,
      //   //   "----config:",
      //   //   config
      //   // );
      //   let xxxx = getFiles(file, null, env, config);
      //   process.chdir(fileCWD);

      //   return xxxx;
      // } else {
      // We add input from the module at start of queue of this module
      if (counter-- === config.files.length) {
        if (config.input) {
          file.input = config.input;
        }
      }

      // We add output from the module at end of queue of this module
      if (counter === 0) {
        if (config.output) {
          file.output = config.output;
        }
      }

      file.path = process.cwd();
      // console.log(file.path, config.filePath);
      // Custom data from the module
      // if (!file.data) file.data = {};
      if (ccc && ccc.data && file.data) {
        // console.log("file.data, ccc.data", file.data, ccc.data);
        Object.assign(file.data, ccc.data);
      }

      if (config.data) {
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
          file.args = file.args.concat(arr.args);
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
      return file;
      //}
    });

  process.chdir(cwd);

  return resultFiles && resultFiles.flat();
};

module.exports = { getFiles };
