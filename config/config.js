process.env.NODE_ENV = "development";

const { homedir } = require("os");

const { findParent } = require("../lib/fs");
const { join, dirname, basename } = require("path");
const { existsSync, mkdirSync, copyFileSync } = require("fs");
const helper = require("../lib/helper");
// NEXSS PATHS
const home = homedir();
const nexssPackagesRepo = "https://github.com/nexssp/packages.git";
const NEXSS_SRC_PATH = join(__dirname, "..");

// User home directory for .nexss eg: C:\Users\mapoart\.nexss
const NEXSS_HOME_PATH =
  process.env.NEXSS_HOME_PATH ||
  (process.env.NEXSS_HOME_PATH = `${home}/.nexss`);

// User home directory for .nexss eg: C:\Users\mapoart\.nexss
const NEXSS_LANGUAGES_PATH =
  process.env.NEXSS_LANGUAGES_PATH ||
  (process.env.NEXSS_LANGUAGES_PATH = `${home}/.nexss/languages`);

// User home directory for .nexss eg: C:\Users\mapoart\.nexss
const NEXSS_PACKAGES_PATH =
  process.env.NEXSS_PACKAGES_PATH ||
  (process.env.NEXSS_PACKAGES_PATH = `${home}/.nexss/packages`);

// Cache directory for .nexss eg: C:\Users\mapoart\.nexss\.cache
const NEXSS_CACHE_PATH =
  process.env.NEXSS_CACHE_PATH ||
  (process.env.NEXSS_CACHE_PATH = `${NEXSS_HOME_PATH}/cache`);

const NEXSS_PROCESS_PATH =
  process.env.NEXSS_PROCESS_PATH ||
  (process.env.NEXSS_PROCESS_PATH = `${NEXSS_HOME_PATH}/process`);

const NEXSS_BACKUP_PATH =
  process.env.NEXSS_BACKUP_PATH ||
  (process.env.NEXSS_BACKUP_PATH = `${NEXSS_HOME_PATH}/backup`);
// console.log("PROCESS CWD!!!!!!!!!!!!! config/config.js", process.cwd());
const NEXSS_PROJECT_CONFIG_PATH = findParent("_nexss.yml");
// console.log("NEXSS_PROJECT_CONFIG_PATH", NEXSS_PROJECT_CONFIG_PATH);
const NEXSS_PROJECT_PATH = NEXSS_PROJECT_CONFIG_PATH
  ? dirname(NEXSS_PROJECT_CONFIG_PATH)
  : undefined;

const NEXSS_PROJECT_SRC_PATH = NEXSS_PROJECT_PATH
  ? process.env.NEXSS_PROJECT_SRC_PATH ||
    (process.env.NEXSS_PROJECT_SRC_PATH = `${NEXSS_PROJECT_PATH}/src`)
  : undefined;

const NEXSS_PROJECTS_DB = `${NEXSS_HOME_PATH}/projects.json`;

// Make sure directories are there
const createIfNotExists = [
  NEXSS_HOME_PATH,
  NEXSS_CACHE_PATH,
  NEXSS_PROCESS_PATH,
  NEXSS_LANGUAGES_PATH
];

try {
  createIfNotExists.forEach(p => {
    if (!existsSync(p)) {
      mkdirSync(p);
    }
  });

  if (!existsSync(NEXSS_PACKAGES_PATH)) {
    // TODO: Double try fix later
    console.log("Downloading nexss packages (Only once).. Please wait..");

    try {
      const repos = require("../nexss-package/repos.dev.json");
      // console.log(repos);
      for (var key in repos) {
        const command = `git clone --recurse-submodules -j8 ${repos[key]} ${NEXSS_PACKAGES_PATH}/${key}`;
        require("child_process").execSync(command, {
          stdio: "inherit"
        });
      }

      console.log(`Nexss Packages has been installed.`);
    } catch (err) {
      if ((err + "").indexOf("Command failed: git clone") > -1) {
        console.error(`Issue with the repository: ${nexssPackagesRepo}`);
      } else {
        // TODO: Better handling of update etc.
        // console.log(
        //   "Language seems to be already there. Trying update..",
        //   error
        // );
        // try {
        //   // We trying update the repo with the latest version as already there
        //   require("child_process").execSync(`git -C ${repoPath} pull`, {
        //     stdio: "inherit"
        //   });
        // } catch (error) {
        //   console.error(error);
        //   process.exit(1);
        // }
        console.error(err);
      }
    }
  }
} catch (error) {
  console.error("There was an error during checking/creating directories:");
  createIfNotExists.forEach(p => {
    console.error(p);
  });
  console.error(error);
  process.exit(1);
}

const copyIfNotExists = [
  ["../nexss-language/languages/config.base.js", NEXSS_LANGUAGES_PATH],
  [
    `../nexss-language/languages/config.${process.platform}.js`,
    NEXSS_LANGUAGES_PATH
  ]
];

try {
  copyIfNotExists.forEach(([src, dest]) => {
    src = join(__dirname, src);
    if (!existsSync(`${basename(src)}/${dest}`)) {
      copyFileSync(src, join(dest, basename(src)));
    }
  });
} catch (error) {
  console.error("There was an error during checking/creating directories:");
  createIfNotExists.forEach(p => {
    console.error(p);
  });
  console.error(error);
  process.exit(1);
}

module.exports = {
  NEXSS_SRC_PATH,
  NEXSS_HOME_PATH,
  NEXSS_CACHE_PATH,
  NEXSS_LANGUAGES_PATH,
  NEXSS_PACKAGES_PATH,
  NEXSS_PROCESS_PATH,
  NEXSS_BACKUP_PATH,
  NEXSS_PROJECT_CONFIG_PATH,
  NEXSS_PROJECT_PATH,
  NEXSS_PROJECT_SRC_PATH,
  NEXSS_PROJECTS_DB
};
