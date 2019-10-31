const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
const fs = require("fs");
const { warn } = require("../../lib/log");
const { loadConfigContent, saveConfigContent } = require("../../lib/config");
const cliArgs = require("minimist")(process.argv.slice(2));
let configContent;
if (cliArgs.configPath) {
  if (fs.existsSync(`${cliArgs.configPath}/_nexss.yml`)) {
    try {
      configContent = loadConfigContent(`${cliArgs.configPath}/_nexss.yml`);
    } catch (error) {
      console.log("This is not nexss PROGRAMMER project.");
    }
  } else {
    warn(`This is not Nexss PROGRAMMER Project.`);
    process.exit(0);
  }
} else {
  configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
}

if (!configContent) {
  warn(`This is not Nexss PROGRAMMER Project.`);
  process.exit(0);
}

if (cliArgs.json) {
  if (cliArgs.select) {
    if (!configContent[cliArgs.select]) {
      console.log(`{}`);
    } else {
      console.log(JSON.stringify(configContent[cliArgs.select], null, 2));
    }
  } else {
    console.log(JSON.stringify(configContent, null, 2));
  }
} else {
  console.log(fs.readFileSync(NEXSS_PROJECT_CONFIG_PATH).toString());
}
