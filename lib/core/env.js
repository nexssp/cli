const { bold, blue, yellow, grey } = require("../color");

const envShow = [
  "NEXSS_SRC_PATH",
  "NEXSS_APPS_PATH",
  "NEXSS_LANGUAGES_PATH",
  "NEXSS_PACKAGES_PATH",
  "NEXSS_CACHE_PATH",
  "NEXSS_BACKUP_PATH",
  "NEXSS_PROJECT_PATH",
];

module.exports = () => {
  console.log(bold(blue(process.title)));
  console.log(blue("\nEnvironment Variables"));
  envShow.forEach((e) => console.log(`${bold(e)}=${process.env[e]}`));
  console.log(blue("\nOS Information"));
  if (process.platform != "win32") {
    const { dist, version } = require("../osys");
    const procVersion = require("child_process")
      .execSync("cat /proc/version")
      .toString()
      .trim();
    const distr = dist();
    console.log("Linux distribution:\t", yellow(bold(distr)));
    if (distr !== "Arch Linux")
      console.log("Linux version:\t\t", yellow(bold(version())));
    console.log(grey(procVersion.replace("Linux version ", "")));
  } else {
    const version = require("child_process").execSync("ver").toString().trim();

    console.log("Windows version:\t\t", yellow(bold(version)));
  }
};
