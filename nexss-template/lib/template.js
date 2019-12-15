const nexssLanguages = require("../../nexss-language/lib/language");
const { getFiles } = require("../../lib/fs");
const { join, extname, dirname } = require("path");
module.exports.templateNames = arg => {
  if (arg) {
    // We remove colors characters if exist
    arg = arg.split(" ")[0];
    arg = arg.replace("\u001b[1m", "");
    arg = arg.replace("\u001b[22m", "");
  }
  let lang = nexssLanguages.getLang(arg);
  let files = getFiles(module.exports.getTemplatesPaths(arg));
  // if (arg) files = files.filter(e => path.extname(e) === arg);
  //return [arg];

  // return files.map(
  //   element =>
  //     `${extname(element)} ${element} - (${resolve(
  //       dirname(lang.configFile),
  //       "templates",
  //       element
  //     )})`
  // );

  return (
    files
      // We need to filter as there are also configuration files .js to
      // make additional operation
      .filter(el => {
        return extname(el) === arg;
      })
      .map(element => `${extname(element)} ${element}`)
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
