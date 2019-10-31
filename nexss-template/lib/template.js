const nexssLanguages = require("../../nexss-language/lib/language");
const { getFiles } = require("../../lib/fs");
const { join, extname, dirname, resolve } = require("path");
module.exports.templateNames = arg => {
  if (arg) {
    // We remove chalk characters
    arg = arg.split(" ")[0];
    arg = arg.replace("\u001b[1m", "");
    arg = arg.replace("\u001b[22m", "");
  }
  let lang = nexssLanguages.getLang(arg);
  let files = getFiles(module.exports.getTemplatesPaths(arg));
  // if (arg) files = files.filter(e => path.extname(e) === arg);
  //return [arg];

  return files.map(
    element =>
      `${extname(element)} ${element} - (${resolve(
        dirname(lang.configFile),
        "templates",
        element
      )})`
  );
};

module.exports.getTemplatesPaths = ext => {
  const lang = nexssLanguages.getLang(ext);
  if (!lang) return;
  //console.log(lang);
  // console.log(module.exports.getLanguages());
  const langPath = dirname(lang.configFile);
  const langFileTemplates = join(langPath, "templates");
  return langFileTemplates;
};
