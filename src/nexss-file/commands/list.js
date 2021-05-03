const { loadConfigContent, saveConfigContent } = require("../../lib/config");
const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
const nexssConfig = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
if (nexssConfig) {
  if (nexssConfig.files && Array.isArray(nexssConfig.files)) {
    nexssConfig.files.map(e => console.log(e.name));
  } else {
    console.log("No files has been found in this project.");
  }
} else {
  console.log("This is not the nexss programmer project.");
}
