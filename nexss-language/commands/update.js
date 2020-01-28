const fs = require("fs");
// const dirTree = require("directory-tree");
const { NEXSS_LANGUAGES_PATH } = require("../../config/config");
const { success, warn, error } = require("../../lib/log");
const cliArgs = require("minimist")(process.argv);

const fg = require("fast-glob");

const cache = require("../../lib/cache");
cache.clean("nexss_core_getLanguages_*");

process.chdir(NEXSS_LANGUAGES_PATH);

const languages = fs.readdirSync(".");
languages.forEach(langDir => {
  console.log(`Updating ${langDir}..`);

  if (fs.existsSync(`${langDir}/.git`)) {
    try {
      require("child_process").execSync(`git pull`, {
        cwd: langDir,
        stdio: "inherit"
      });
      success(`Language updated`);
    } catch (er) {
      error(er);
      process.exit();
    }
  } else {
    warn("it is not git repository, ommiting");
  }
});
