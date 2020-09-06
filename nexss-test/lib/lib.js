const { execSync } = require("child_process");

function yellow(s) {
  return `\x1b[33m${s}\x1b[0m`;
}

function blue(s) {
  return `\x1b[34m${s}\x1b[0m`;
}

function green(s) {
  return `\x1b[32m${s}\x1b[0m`;
}

function red(s) {
  return `\x1b[31m${s}\x1b[0m`;
}

function bright(s) {
  return `\x1b[1m${s}\x1b[0m`;
}

function camelCase(text) {
  var result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function exe(command, options) {
  if (process.platform !== "win32") {
    if (!options) options = {};
    Object.assign(options, { shell: "/bin/bash" });
  }
  try {
    const r = execSync(`${command} --nxsPipeErrors`, options).toString();

    return r;
  } catch (er) {
    if (process.argv.includes("--errors")) {
      console.error(er);
    }
    if (options && options.stopOnErrors) process.exit(1);
  }
}

var fs = require("fs");

// https://geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = {
  yellow,
  blue,
  green,
  red,
  bright,
  camelCase,
  exe,
  deleteFolderRecursive,
};
