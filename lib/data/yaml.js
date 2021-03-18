const yaml = {
  read(yamlFile) {
    const { readFileSync } = require("fs");
    return require("js-yaml").load(readFileSync(yamlFile, "utf8"));
  },
  write(yamlFile, object) {
    try {
      const { writeFileSync } = require("fs");
      writeFileSync(yamlFile, require("js-yaml").dump(object));
    } catch (e) {
      throw new Error(e.message);
    }
  },
};

module.exports.yaml = yaml;
