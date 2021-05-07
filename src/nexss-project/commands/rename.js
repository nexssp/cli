const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
if (!NEXSS_PROJECT_CONFIG_PATH) {
  log.warn(bold(`You are not in the Nexss Programmer Project`));

  return;
}

const paramName = cliArgs._[2];
if (!paramName) {
  log.warn(bold("Enter new project name."));
  process.exit();
}

const { loadConfigContent, saveConfigContent } = require("../../lib/config");
let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
configContent.name = paramName;
saveConfigContent(configContent, NEXSS_PROJECT_CONFIG_PATH);
log.success("Done..");
