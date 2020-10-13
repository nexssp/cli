const { execSync, spawnSync } = require("child_process");

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

if (process.versions.node.split(".")[0] * 1 < 12) {
  const { nSpawnSync } = require("../../lib/nProcess");
  exe = nSpawnSync; // Because of the NODEJS 10.
} else {
  exe = exeOLD;
}

function exeOLD(command, options) {
  options = options || {};
  if (process.platform !== "win32") {
    Object.assign(options, { shell: process.shell });
  }

  // options.maxBuffer = 52428800; // 10*default
  let r;
  try {
    r = execSync(`${command} --nxsPipeErrors`, options).toString();
    return r;
  } catch (er) {
    r = er.stdout.toString();
    // err.stderr;
    // err.pid;
    // err.signal;
    // err.status;
    if (process.argv.includes("--errors")) {
      console.error(er);
    }
    if (options && options.stopOnErrors) process.exitCode = 1;
  }
  return r;
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
