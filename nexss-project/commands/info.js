//inspect project
//console.log(nexssConfig.getConfigFilePath());
const util = require("util");
const { loadConfigContent, saveConfigContent } = require("../../lib/config");
const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
const nexssConfig = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

const { warn, info } = require("../../lib/log");
const { bold, green, blue, grey } = require("../../lib/color");

if (!nexssConfig) {
  warn(`This is not ${bold("Nexss PROGRAMMER project")}`);
  info(
    `Create new project:
      New folder: ${bold("nexss project new MyProjectName")} OR ${bold(
      "nexss p n MyProjectName"
    )}
      Current folder: ${bold("nexss project new .")} OR ${bold("nexss p n .")}
    `
  );

  process.exit(0);
}
const files = nexssConfig.files;
const pInfo = () => {
  return `
    Name: ${bold(green(nexssConfig.name))}
    Files: ${blue(files && files.length)} ${grey("nexss f add myfile.php")}
    Config file: ${util.inspect(nexssConfig)}
    `;
};

console.log(pInfo());
console.table(files);
