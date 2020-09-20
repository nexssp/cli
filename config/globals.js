// Main Globals

const PROCESS_CWD = process.cwd();
// Adding colors etc
Object.assign(global, require("@nexssp/ansi"));
// Log functions

const dev_colors = require("../lib/core/dev-colors");
const fs = require("fs");
const functions = {
  fs, // https://nodejs.org/api/fs.html
  path: require("path"), // https://nodejs.org/api/path.html
  child_process: require("child_process"),
  dev_colors,
  mem: process.memoryUsage, // https://nodejs.org/api/process.html#process_process_memoryusage
  PROCESS_CWD,
};

const globalConfigPath = require("os").homedir() + "/.nexss/config.json";

if (fs.existsSync(globalConfigPath)) {
  process.nexssGlobalConfig = require(globalConfigPath);
} else {
  process.nexssGlobalConfig = { languages: {} };
}

Object.assign(global, functions);
