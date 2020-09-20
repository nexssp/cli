const fs = require("fs");
// We make sure application is installed.
if (!fs.existsSync(`${__dirname}/node_modules`)) {
  const command = `npm install --production`;
  try {
    cp.execSync(command, {
      stdio: "inherit",
      detached: false,
      shell: process.platform === "win32" ? true : "/bin/bash",
      cwd: __dirname,
    });
  } catch (error) {
    console.log(`Command failed ${command}`);
  }
}

const PROCESS_CWD = process.cwd();
const dev_colors = require("../lib/core/dev-colors");

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
