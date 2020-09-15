const { success, warn } = require("../../lib/log");
const { bold } = require("../../lib/ansi");

const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
if (!NEXSS_PROJECT_CONFIG_PATH) {
  warn(bold(`You are not in the Nexss Programmer Project`));

  return;
}

const paramName = process.argv[4];
if (!paramName) {
  warn(bold("Enter new project name."));
  process.exit();
}

const { loadConfigContent, saveConfigContent } = require("../../lib/config");
let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
configContent.name = paramName;
saveConfigContent(configContent, NEXSS_PROJECT_CONFIG_PATH);
success("Done..");
