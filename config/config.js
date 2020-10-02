// Nexss Programmer
// Environment setup - config.js
// NEXSS_HOME_PATH, NEXSS_APPS_PATH, NEXSS_LANGUAGES_PATH,
// NEXSS_PACKAGES_PATH, NEXSS_CACHE_PATH, NEXSS_BACKUP_PATH,
// NEXSS_SRC_PATH, NEXSS_PROJECTS_DB
require("../lib/helper");
const { join, dirname, normalize } = require("path");
const cache = require("../lib/cache");
const { homedir } = require("os");
const { existsSync } = require("fs");
const { bold } = require("@nexssp/ansi");
// User home directory for .nexss eg: C:\Users\mapoart\.nexss
const home = homedir();

const NEXSS_HOME_PATH =
  process.env.NEXSS_HOME_PATH ||
  (process.env.NEXSS_HOME_PATH = normalize(`${home}/.nexss`));

function getConfig() {
  const { basename } = require("path");
  const { existsSync, mkdirSync, copyFileSync } = require("fs");

  // NEXSS PATHS
  const NEXSS_APPS_PATH =
    process.env.NEXSS_APPS_PATH ||
    (process.env.NEXSS_APPS_PATH = normalize(`${home}/.nexssApps`));

  // User home directory for .nexss eg: C:\Users\mapoart\.nexss
  const NEXSS_LANGUAGES_PATH =
    process.env.NEXSS_LANGUAGES_PATH ||
    (process.env.NEXSS_LANGUAGES_PATH = normalize(
      `${NEXSS_HOME_PATH}/languages`
    ));

  // User home directory for .nexss eg: C:\Users\mapoart\.nexss
  const NEXSS_PACKAGES_PATH =
    process.env.NEXSS_PACKAGES_PATH ||
    (process.env.NEXSS_PACKAGES_PATH = normalize(
      `${NEXSS_HOME_PATH}/packages`
    ));

  // Cache directory for .nexss eg: C:\Users\mapoart\.nexss\.cache
  const NEXSS_CACHE_PATH =
    process.env.NEXSS_CACHE_PATH ||
    (process.env.NEXSS_CACHE_PATH = normalize(`${NEXSS_HOME_PATH}/cache`));

  const NEXSS_BACKUP_PATH =
    process.env.NEXSS_BACKUP_PATH ||
    (process.env.NEXSS_BACKUP_PATH = normalize(`${NEXSS_HOME_PATH}/backup`));

  const NEXSS_PROJECTS_DB = normalize(`${NEXSS_HOME_PATH}/projects.json`);

  const NEXSS_SRC_PATH =
    process.env.NEXSS_SRC_PATH ||
    (process.env.NEXSS_SRC_PATH = join(__dirname, ".."));

  // Make sure directories are there
  const createIfNotExists = [
    NEXSS_HOME_PATH,
    NEXSS_CACHE_PATH,
    NEXSS_LANGUAGES_PATH,
    NEXSS_APPS_PATH,
  ];

  try {
    createIfNotExists.forEach((p) => {
      if (!existsSync(p)) {
        mkdirSync(p);
      }
    });
  } catch (error) {
    console.error("There was an error during checking/creating directories:");
    createIfNotExists.forEach((p) => {
      console.error(p);
    });
    console.error(error);
    process.exit();
  }

  const copyIfNotExists = [
    ["../nexss-language/languages/config.base.js", NEXSS_LANGUAGES_PATH],
    [
      `../nexss-language/languages/config.${process.platform}.js`,
      NEXSS_LANGUAGES_PATH,
    ],
  ];

  try {
    copyIfNotExists.forEach(([src, dest]) => {
      const destination = join(dest, basename(src));
      if (!existsSync(destination)) {
        copyFileSync(join(__dirname, src), destination);
      }
    });
  } catch (error) {
    console.error("There was an error during checking/creating directories:");
    createIfNotExists.forEach((p) => {
      console.error(p);
    });
    console.error(error);
    process.exit();
  }
  try {
    if (!existsSync(`${NEXSS_PACKAGES_PATH}/Nexss`)) {
      console.log(bold("Installing Nexss main package.."));
      // Auto install of packages
      require("../nexss-package/lib/install").installPackages(
        NEXSS_PACKAGES_PATH,
        "Nexss"
      );
    }
  } catch (error) {
    console.error("Error during downloading packages");
  }

  return {
    NEXSS_SRC_PATH,
    NEXSS_HOME_PATH,
    NEXSS_APPS_PATH,
    NEXSS_CACHE_PATH,
    NEXSS_LANGUAGES_PATH,
    NEXSS_PACKAGES_PATH,
    NEXSS_BACKUP_PATH,
    NEXSS_PROJECTS_DB,
  };
}

const { findParent } = require("../lib/fs");

const NEXSS_PROJECT_CONFIG_PATH = findParent("_nexss.yml");
// console.log("NEXSS_PROJECT_CONFIG_PATH", NEXSS_PROJECT_CONFIG_PATH);
const NEXSS_PROJECT_PATH = NEXSS_PROJECT_CONFIG_PATH
  ? dirname(NEXSS_PROJECT_CONFIG_PATH)
  : undefined;

const NEXSS_PROJECT_SRC_PATH = NEXSS_PROJECT_PATH
  ? process.env.NEXSS_PROJECT_SRC_PATH ||
    (process.env.NEXSS_PROJECT_SRC_PATH = normalize(
      `${NEXSS_PROJECT_PATH}/src`
    ))
  : undefined;

const getConfigCacheName = `nexss_core_main_config__.json`;
let config;
if (existsSync(NEXSS_HOME_PATH) && cache.exists(getConfigCacheName, "1y")) {
  config = JSON.parse(cache.read(getConfigCacheName));
} else {
  config = getConfig();
  cache.write(getConfigCacheName, JSON.stringify(config));
}
const result = Object.assign({}, config, {
  NEXSS_PROJECT_CONFIG_PATH,
  NEXSS_PROJECT_PATH,
  NEXSS_PROJECT_SRC_PATH,
  NEXSS_CWD: process.cwd(),
});

process.env = Object.assign({}, process.env, result);
module.exports = result;
