const { getLangByFilename } = require("../../../nexss-language/lib/language");
const fs = require("fs");
const path = require("path");
const { ensureInstalled } = require("../../../lib/terminal");

module.exports.getBuilder = (file) => {
  const fileName = file.name;

  const languageDefinition = getLangByFilename(fileName);

  if (!fs.existsSync(`_nexss`)) {
    try {
      fs.mkdirSync(`_nexss`, { recursive: true });
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }
  }

  let builder;

  if (languageDefinition) {
    builder =
      languageDefinition.builders[Object.keys(languageDefinition.builders)[0]];
  }

  try {
    if (typeof builder.build === "function") {
      cmd = builder.build();
    } else if (typeof eval(builder.build) === "function") {
      //During cache we need to eval to get that is function.
      cmd = eval(builder.build)();
    } else {
      cmd = builder.build;
    }
  } catch (e) {
    cmd = builder.build;
  }

  if (!cmd) cmd = builder.cmd;
  ensureInstalled(cmd, builder.install);

  return builder;
};
