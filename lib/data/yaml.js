const jsyaml = require("js-yaml");
// const { readFileSync, writeFileSync } = require("fs");
const yaml = {
  read(yamlFile) {
    const { readFileSync } = require("fs");
    return jsyaml.safeLoad(readFileSync(yamlFile, "utf8"));
  },
  write(yamlFile, object) {
    try {
      const { writeFileSync } = require("fs");
      writeFileSync(yamlFile, jsyaml.dump(object));
    } catch (e) {
      throw new Error(e.message);
    }
  }
};

module.exports.yaml = yaml;
