/*
 * Title: Nexss FUNCTIONS - fs
 * Description: Nexss helper functions for filesystem.
 * Author: Marcin Polak
 * 2018/10/01 initial version
 */

const findParent = item => {
  const { statSync } = require("fs");
  const { resolve, join, dirname, parse } = require("path");

  const f = i => {
    try {
      if (statSync(i).isFile()) {
        return i;
      }
    } catch (error) {
      // console.log(error);
    }

    var parent = dirname(resolve("..", i));
    //console.log(parent);
    if (parse(parent).root === parent) {
      return null;
    }
    return f(join("..", i));
  };

  return f(item);
};

const getFiles = source => {
  const fs = require("fs");
  const { join } = require("path");
  return fs
    .readdirSync(source)
    .filter(name => !fs.lstatSync(join(source, name)).isDirectory());
};

const trimExtension = filename =>
  filename
    .split(".")
    .slice(0, -1)
    .join(".");

const addTimeStampToFilename = filename => {
  const extension = require("path").extname(filename);
  const timestamp = new Date().toJSON().replace(/:/g, ".");
  return `${trimExtension(filename)}_${timestamp}${extension}`;
};

function accessible(file) {
  if (!file) return false;

  try {
    fs.accessSync(file);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  findParent,
  getFiles,
  trimExtension,
  addTimeStampToFilename
};
