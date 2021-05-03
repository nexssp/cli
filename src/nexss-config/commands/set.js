const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
const fs = require("fs");
const { warn } = require("../../lib/log");
const { loadConfigContent, saveConfigContent } = require("../../lib/config");

// TODO: To make DRY here on set and get commands.
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
  try {
    let parsedJson;
    parsedJson = JSON.parse(cliArgs.json);

    if (cliArgs._[2]) {
      const temp = Object.assign({}, parsedJson);
      parsedJson = {};
      parsedJson[cliArgs._[2]] = temp;
    }
    Object.assign(configContent, parsedJson);

    saveConfigContent(configContent, NEXSS_PROJECT_CONFIG_PATH);
  } catch (e) {
    console.error("JSON couldn't be imported", e);
  }
} else {
  console.error(
    "Pass -json parameter with json string. See help by command: nexss config set help"
  );
}
