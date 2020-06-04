const nexssLanguages = require("../../nexss-language/lib/language");
const { getFiles } = require("../../lib/fs");
const { join, extname, dirname } = require("path");
const { error } = require("../../lib/log");
const { bold } = require("../../lib/color");

module.exports.templateNames = (arg) => {
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
      .filter((el) => {
        return extname(el) === arg;
      })
      .map((element) => `${extname(element)} ${element}`)
  );
};

module.exports.getTemplatesPaths = (ext) => {
  const fs = require("fs");
  const lang = nexssLanguages.getLang(ext);
  const extWithOutDot = ext.substring(1);
  //   console.log(NEXSS_HOME_PATH);
  if (!lang) return;
  //console.log(lang);
  // console.log(module.exports.getLanguages());

  const globalConfigPath = require("os").homedir() + "/.nexss/config.json";
  // const tempFilePath = require("os").homedir() + "/.nexss/xxxxx.json";
  // const l = data => fs.appendFileSync(tempFilePath, data + "\n");

  // We check if there is something about global config changed
  let globalConfig;
  let templateFolder = "templates";
  if (fs.existsSync(globalConfigPath)) {
    // l("Config file exists");
    globalConfig = require(globalConfigPath);
    const languageGlobalConfig =
      globalConfig.languages && globalConfig.languages[extWithOutDot];

    if (
      languageGlobalConfig &&
      lang.compilers[languageGlobalConfig.compilers]
    ) {
      //l(`Global Compiler Selected: ${languageGlobalConfig.compilers}`);
      templateFolder =
        lang.compilers[languageGlobalConfig.compilers].templates || "templates";
      //l(
      //  `compilers: ${JSON.stringify(
      //    lang.compilers[languageGlobalConfig.compilers]
      //  )}`
      //);
      //l(`Template folder ${templateFolder}`);
    } else {
      templateFolder =
        (lang.compilers &&
          Object.keys(lang.compilers) &&
          lang.compilers[Object.keys(lang.compilers)[0]] &&
          lang.compilers[Object.keys(lang.compilers)[0]].templates) ||
        "templates";
    }
  }

  // [ext.splice(1)];
  const langPath = dirname(lang.configFile);
  const langFileTemplates = join(langPath, templateFolder);

  if (!require("fs").existsSync(langFileTemplates)) {
    error(
      `Folder ${langFileTemplates} with templates does not exist. Probably has been manually deleted.`
    );
    error(
      `Please run with --nocache to recreate cache and try again. eg: 'nexss Id --nocache'`
    );
    process.exit();
  }
  return langFileTemplates;
};
