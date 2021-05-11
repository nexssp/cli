const fs = require("fs");
// const dirTree = require("directory-tree");
const { NEXSS_LANGUAGES_PATH } = require("../../config/config");
const { ensureInstalled } = require("@nexssp/ensure");
const cache = require("@nexssp/cache");
if (cliArgs.nocache) {
  cache.recreateCache(); //set flag to recreate cache
}
cache.clean("nexss_core_getLanguages_*");

process.chdir(NEXSS_LANGUAGES_PATH);

const config = require(`../../nexss-language/languages/config.${process.platform}`);
const osPM = config.osPackageManagers[Object.keys(config.osPackageManagers)[0]];

ensureInstalled("git", `${osPM.installCommand} git`, {
  progress: cliArgs.progress,
});
const spawnOptions = require("../../config/spawnOptions");

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
      const packageJson = require("path").join(langDir, "package.json");
      if (fs.existsSync(packageJson)) {
        require("child_process").execSync(
          `npm install`,
          spawnOptions({
            stdio: "inherit",
            cwd: langDir,
          })
        );
      }

      log.success(`Language updated`);
    } catch (er) {
      console.log(
        `There was an error on command: ${bold(command)}, folder: ${bold(
          langDir
        )}`,
        er
      );
      // error(er);
      process.exit();
    }
  } else {
    log.warn("it is not git repository, ommiting");
  }
});
