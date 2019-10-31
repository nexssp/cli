// Language download-all
// Language add git://sadasdasd, name: git://nexssp/language-name
// Language update
const {
  NEXSS_PROJECT_PATH,
  NEXSS_LANGUAGES_PATH,
  NEXSS_HOME_PATH
} = require("../../config/config");
const { join, extname, resolve } = require("path");
const { warn, error, success } = require("../../lib/log");
const { bold, yellow } = require("../../lib/color");

function getLanguagesConfigFiles(projectFolder = "") {
  let paths = [];
  const fg = require("fast-glob");
  const languagePathArray = [
    "languages",
    "**",
    `*.${process.platform}.nexss.config.js`
  ];

  // ../languages/php/win32.nexss.config.js
  paths.push(join(__dirname, "..", ...languagePathArray).replace(/\\/g, "/"));
  // di(`Languages Path: ${nexssLanguagesConfigPath}`);

  // PROJECTPATH/languages/php/win32/nexss.config.js
  paths.push(join(NEXSS_HOME_PATH, ...languagePathArray).replace(/\\/g, "/"));
  // console.log(NEXSS_PROJECT_PATH, "x");
  // process.exit(1);
  if (NEXSS_PROJECT_PATH) {
    paths.push(
      join(resolve(NEXSS_PROJECT_PATH), ...languagePathArray).replace(
        /\\/g,
        "/"
      )
    );
  }

  return fg.sync(paths);
}

module.exports.getLanguages = extensions => {
  if (extensions && !Array.isArray(extensions)) {
    throw new Error(`Function getLanguages needs to pass extensions as array 
or no parameter for all languages.`);
  }

  let result = {};
  const files = getLanguagesConfigFiles(NEXSS_PROJECT_PATH);

  for (file of files) {
    let content = require(file);
    content.extensions.forEach(languageExtension => {
      if (!extensions || extensions.includes(languageExtension)) {
        result[languageExtension] = content;
        result[languageExtension]["configFile"] = file;
      }
    });
  }
  return result;
};

const languages = module.exports.getLanguages();

module.exports.languageNames = () => {
  if (languages)
    return Object.keys(languages)
      .map(
        language =>
          `${bold(languages[language].extensions[0])} ${yellow(
            bold(languages[language].url.replace("https://", ""))
          )} - ${languages[language].description}`
      )
      .sort();
};

module.exports.getLang = ext => {
  if (!ext) {
    return false;
  }
  let Languages = module.exports.getLanguages([ext]);

  if (Object.keys(Languages).length === 0) {
    warn(
      `New extension '${bold(
        ext
      )}', checking online repository for implementation..`
    );

    let langRepositories;
    // checking online repository
    if (process.env.NODE_ENV === "PRODUCTION") {
      langRepositories = require("../repos.json");
    } else {
      langRepositories = require("../repos.dev.json");
    }

    const { ensureInstalled } = require("../../lib/terminal");

    const config = require(`../../nexss-language/languages/config.${process.platform}`);
    const osPM = config.getFirst("osPackageManagers");

    if (langRepositories[ext]) {
      ensureInstalled(osPM.keyOfItem, osPM.installation);
      ensureInstalled("git", `${osPM.install} git`);

      const repoName = require("path").basename(langRepositories[ext]);
      const repoPath = `${NEXSS_LANGUAGES_PATH}/${repoName}`;
      try {
        require("child_process").execSync(
          `git clone ${langRepositories[ext]} ${repoPath}`,
          {
            stdio: "inherit"
          }
        );
        success(`Implementation for '${ext}' has been installed.`);
      } catch (error) {
        if ((error + "").indexOf("Command failed: git clone") > -1) {
          console.error(
            `Issue with the repository: ${bold(langRepositories[ext])}`
          );
        } else {
          console.log(
            "Language seems to be already there. Trying update..",
            error
          );
          try {
            // We trying update the repo with the latest version as already there
            require("child_process").execSync(`git -C ${repoPath} pull`, {
              stdio: "inherit"
            });
          } catch (error) {
            console.error(error);
            process.exit(1);
          }
        }
      }

      Languages = module.exports.getLanguages([ext]);
    } else {
      warn(
        `Nexss Online Github Repository: Support for language with extension ${ext} has not been found. Please consider installing it manually.`
      );
      process.exit(0);
    }

    // let Languages = module.exports.getLanguages([ext]);
  }
  const lang = Languages[ext];
  if (!lang) {
    warn(`Support for '${bold(ext)}' has not been found.`);
    process.exit();
  }

  //We add some defaults if not exists ???????????
  // if (!lang) return false;

  return lang;
};

module.exports.getLangByFilename = name => {
  const ext = extname(name);
  return module.exports.getLang(ext);
};
