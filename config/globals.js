Object.assign(global, require("@nexssp/ansi"));

const dev_colors = require("../lib/core/dev-colors");

const functions = {
  fs: require("fs"), // https://nodejs.org/api/fs.html
  path: require("path"), // https://nodejs.org/api/path.html
  dev_colors,
  mem: process.memoryUsage, // https://nodejs.org/api/process.html#process_process_memoryusage
};

Object.assign(global, functions);
