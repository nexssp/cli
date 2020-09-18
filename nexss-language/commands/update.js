const fs = require("fs");
// const dirTree = require("directory-tree");
const { NEXSS_LANGUAGES_PATH } = require("../../config/config");
const { success, warn, error } = require("../../lib/log");
const { yellow, bold } = require("@nexssp/ansi");
const cliArgs = require("minimist")(process.argv);

const fg = require("fast-glob");

const cache = require("../../lib/cache");
cache.clean("nexss_core_getLanguages_*");

process.chdir(NEXSS_LANGUAGES_PATH);

const languages = fs.readdirSync(".");
languages.forEach((langDir) => {
  console.log(yellow(`Updating ${langDir}..`));
  const command = `git pull --rebase`;
  if (fs.existsSync(`${langDir}/.git`)) {
    try {
      require("child_process").execSync(command, {
        cwd: langDir,
        stdio: "inherit",
      });
      success(`Language updated`);
    } catch (er) {
      console.log(
        `There was an error on command: ${bold(command)}, folder: ${bold(
          langDir
        )}`
      );
      // error(er);
      process.exit();
    }
  } else {
    warn("it is not git repository, ommiting");
  }
});
