module.exports.loadConfigContent = (filePath) => {
  const { yaml } = require("./data/yaml");

  // Cache L1
  // if (process.nexssConfigContent) return process.nexssConfigContent;

  let file;
  if (!filePath) {
    file = require("./fs").findParent("_nexss.yml");
  } else {
    file = filePath;
  }
  if (!file) return undefined;
  let content;

  try {
    content = yaml.read(file, "utf8");
    content.filePath = path.resolve(file);
    // process.nexssConfigContent = content;
    return content;
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(error.message);
    }
  }
  return;
};

module.exports.saveConfigContent = (content, filePath) => {
  const { yaml } = require("./data/yaml");
  delete content.filePath;

  try {
    yaml.write(filePath, content);
  } catch (e) {
    console.trace(bold(e.message));
    process.exit();
  }
};
