const envShow = [
  "NEXSS_SRC_PATH",
  "NEXSS_APPS_PATH",
  "NEXSS_LANGUAGES_PATH",
  "NEXSS_PACKAGES_PATH",
  "NEXSS_CACHE_PATH",
  "NEXSS_BACKUP_PATH",
  "NEXSS_PROJECT_PATH",
];
const { bold } = require("../color");
module.exports = () => {
  envShow.forEach((e) => console.log(`${bold(e)}=${process.env[e]}`));
};
