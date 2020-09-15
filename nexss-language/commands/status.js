const fs = require("fs");
// const dirTree = require("directory-tree");
const { NEXSS_LANGUAGES_PATH } = require("../../config/config");
const { info, warn, error, header } = require("../../lib/log");
const { red, bold, yellow, purple, underscore } = require("../../lib/ansi");
const cliArgs = require("minimist")(process.argv);
const { execSync } = require("child_process");
const fg = require("fast-glob");

const cache = require("../../lib/cache");
cache.clean("nexss_core_getLanguages_*");

process.chdir(NEXSS_LANGUAGES_PATH);
header("Starting");
const languages = fs.readdirSync(".");
languages.forEach((langDir) => {
  if (fs.existsSync(`${langDir}/.git`)) {
    try {
      checkStatus(langDir);
    } catch (er) {
      error(er);
      process.exit();
    }
  } else {
    info(`${bold(langDir)} is not git repository, ommiting`);
  }
});

function checkStatus(cwd) {
  r = execSync(`git status`, {
    cwd,
  });
  if (r) {
    r = r.toString();
    if (
      r.includes("Untracked files") ||
      r.includes("Changes not staged for commit")
    ) {
      console.log(underscore(red(`${bold(cwd)} is not up to date.`)));
      console.log(
        yellow(
          r
            .replace("Untracked files", purple("Untracked files"))
            .replace(
              "Changes not staged for commit",
              purple("Changes not staged for commit")
            )
        )
      );
    }
  }
}
