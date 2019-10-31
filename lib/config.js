const { yaml } = require("./data/yaml");
const { findParent } = require("./fs");
const { resolve } = require("path");
module.exports.loadConfigContent = filePath => {
  let file;
  if (!filePath) {
    file = findParent("_nexss.yml");
  } else {
    file = filePath;
  }
  if (!file) return undefined;
  let content;
  try {
    content = yaml.read(file, "utf8");
    content.filePath = resolve(file);
    return content;
  } catch (error) {
    console.error(error);
  }
  return;
};

module.exports.saveConfigContent = (content, filePath) => {
  delete content.filePath;

  try {
    yaml.write(filePath, content);
  } catch (e) {
    console.trace(bold(e.message));
    process.exit(1);
  }
};
