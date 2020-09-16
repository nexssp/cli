Object.assign(global, require("../lib/ansi"));

const dev_colors = require("../lib/core/dev-colors");

const functions = {
  fs: require("fs"),
  path: require("path"),
  dev_colors,
};

Object.assign(global, functions);
