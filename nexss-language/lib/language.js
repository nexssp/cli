const NEXSS_PROJECT_PATH = process.env.NEXSS_PROJECT_PATH;
const NEXSS_LANGUAGES_PATH = process.env.NEXSS_LANGUAGES_PATH;
const NEXSS_HOME_PATH = process.env.NEXSS_HOME_PATH;
const { join, extname, resolve } = require("path");
const { warn, success, error, info, dy, dg } = require("@nexssp/logdebug");
const { bold, yellow, red } = require("@nexssp/ansi");
const cache = require("../../lib/cache");

function getLanguagesConfigFiles() {
  let paths = [];
  const fg = require("fast-glob");
  const languagePathArray = [
    "languages",
    "**",
    `*.${process.platform}.nexss.config.js`,
  ];

  // ../languages/php/win32.nexss.config.js
  paths.push(join(__dirname, "..", ...languagePathArray).replace(/\\/g, "/"));
  // di(`Languages Path: ${nexssLanguagesConfigPath}`);

  // PROJECTPATH/languages/php/win32/nexss.config.js
  paths.push(join(NEXSS_HOME_PATH, ...languagePathArray).replace(/\\/g, "/"));
  // console.log(NEXSS_PROJECT_PATH, "x");
  // process.exit();
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

module.exports.getLanguages = (recreateCache) => {
  const getLanguagesCacheName = `nexss_core_getLanguages__.json`;
  if (!recreateCache && cache.exists(getLanguagesCacheName, "1y")) {
    return cache.readJSON(getLanguagesCacheName);
  }

  let result = {};
  const files = getLanguagesConfigFiles(NEXSS_PROJECT_PATH);

  for (file of files) {
    let content;
    try {
      content = require(file);
    } catch (e) {
      console.error(
        bold(red("! >>> There is an issue with the file:")),
        bold(file),
        bold(e)
      );
      // process.exit(0);
      process.exitCode = 1;
      return;
    }

    if (!content || !content.extensions) {
      console.error("File has no .extensions which should be an array.", file);
      process.exitCode = 1;
      return;
    }
    content.extensions.forEach((languageExtension) => {
      result[languageExtension] = content;
      result[languageExtension]["configFile"] = file;
    });
  }

  // Store only if there is something in the cache
  if (Object.keys(result).length > 0) {
    cache.writeJSON(getLanguagesCacheName, result);
  }

  return result;
};

module.exports.languageNames = () => {
  const languages = module.exports.getLanguages();
  if (languages)
    return Object.keys(languages)
      .map(
        (language) =>
          `${bold(languages[language].extensions[0])} ${yellow(
            bold(languages[language].url.replace("https://", ""))
          )} - ${languages[language].description}`
      )
      .sort();
};

module.exports.getLang = (ext, recreateCache) => {
  // Cache L1
  if (ext) {
    if (process.languages && process.languages[ext]) {
      return process.languages[ext];
    }

    let language;
    const getLanguageCacheName = `nexss_core_getLanguages_${ext}_.json`;
    if (!recreateCache && cache.exists(getLanguageCacheName, "1y")) {
      language = cache.readJSON(getLanguageCacheName);
      dg(`[CACHE] Read JSON`);
    } else {
      language = module.exports.getLanguages(recreateCache);
      if (!language) {
        error(
          "There was an error with loading languages. Do you see any other errors before?"
        );
        return;
      }
      language = language[ext];
    }

    if (!language) {
      dy(`[CACHE] recreate cache`);
      console.log(
        green(
          bold(
            `New extension '${bold(
              ext
            )}', checking online repository for implementation..`
          )
        )
      );

      const langRepositories = require("../repos.json");

      const { ensureInstalled } = require("../../lib/terminal");

      const config = require(`../../nexss-language/languages/config.${process.platform}`);

      const osPM =
        config.osPackageManagers[Object.keys(config.osPackageManagers)[0]];
      if (langRepositories[ext]) {
        ensureInstalled(osPM.keyOfItem, osPM.installation);
        ensureInstalled(
          "git",
          `${osPM.install ? osPM.install : osPM.installCommand} git`
        );

        const repoName = require("path").basename(langRepositories[ext]);
        const repoPath = `${NEXSS_LANGUAGES_PATH}/${repoName}`;
        const spawnOptions = require("../../config/spawnOptions");
        const repoPathPackageJson = require("path").join(
          repoPath,
          "package.json"
        );

        const repoPathNodeModules = require("path").join(
          repoPath,
          "node_modules"
        );
        if (require("fs").existsSync(repoPath)) {
          console.log(
            `Language seems to be already there. Updating repo silently at:\n${bold(
              repoPath
            )}`
          );
          try {
            // We trying update the repo with the latest version as already there
            require("child_process").execSync(
              `git -C ${repoPath} pull -q`,
              spawnOptions({
                stdio: "inherit",
              })
            );

            // This language has extra packages, we install/update them
            if (
              require("fs").existsSync(repoPathPackageJson) &&
              !require("fs").existsSync(repoPathNodeModules)
            ) {
              console.log(`Installing packages for ${repoPath}`);
              require("child_process").execSync(
                `npm install`,
                spawnOptions({
                  stdio: "inherit",
                  cwd: repoPath,
                })
              );
            }
          } catch (e) {
            console.error(e);
            process.exit();
          }
        } else {
          try {
            require("child_process").execSync(
              `git clone --depth=1 ${langRepositories[ext]} ${repoPath}`,
              spawnOptions({
                stdio: "inherit",
              })
            );

            // This language has extra packages, we install them

            if (
              require("fs").existsSync(repoPathPackageJson) &&
              !require("fs").existsSync(repoPathNodeModules)
            ) {
              require("child_process").execSync(
                `npm install`,
                spawnOptions({
                  stdio: "inherit",
                  cwd: repoPath,
                })
              );
            }
          } catch (error) {
            if ((error + "").indexOf("Command failed: git clone") > -1) {
              console.error(
                `Issue with the repository: ${bold(langRepositories[ext])}`,
                error
              );

              process.exit(1);
            }
          }
        }

        info(`Implementation for '${ext}' has been installed.`);

        cache.del(`nexss_core_getLanguages__.json`);
        cache.del(`nexss_core_getLanguages_${ext}_.json`);
        const x = module.exports.getLanguages(true);
        const { dist } = require("../../lib/osys");
        const distName = dist();
        if (!x[ext]) {
          const { error } = require("../../lib/log");
          error(
            "Error:",
            bold(ext),
            "is not implemented for",
            bold(process.platform) + (distName ? " " + distName : ""),
            "platform."
          );
          process.exit(1);
        }

        language = module.exports.getLang(ext);
        if (process.platform !== "win32") {
          if (language.dist !== distName) {
            // This is different distribution probably no setup for other then Ubuntu
            warn(
              `Your linux distribution ${bold(
                distName
              )} is not configured for the extension ${bold(
                ext
              )}. Default configuration will be used (It may appears with errors and finally not working properly). To see configuration use 'nexss ${bold(
                ext.replace(".", "")
              )} config'`
            );
          }
        }
      } else {
        warn(
          `Nexss online Github repository: Support for language with extension ${ext} has not been found. Please consider installing it manually.`
        );
        process.exit(0);
      }
    }

    if (!language) {
      warn(`File with extension ${ext} is not supported.`);
    }

    cache.writeJSON(getLanguageCacheName, language);

    if (!process.languages) process.languages = {};
    process.languages[ext] = language;

    return language;
  }
};

module.exports.getLangByFilename = (name, recreateCache) => {
  const ext = extname(name);
  return module.exports.getLang(ext, recreateCache);
};
