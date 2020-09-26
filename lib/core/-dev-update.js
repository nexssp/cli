module.exports = () => {
  const { NEXSS_SRC_PATH } = require("../../config/config");
  const { success, error } = require("../../lib/log");
  const { bold } = require("@nexssp/ansi");
  const { existsSync } = require("fs");
  if (existsSync(__dirname + "/../../.git")) {
    const tag = process.argv[3];
    if (!tag) {
      console.error("Enter version number eg. 2.0, 2.1.. or master");
      process.exit(1);
    }
    try {
      require("child_process").execSync(`git checkout ${tag}`, {
        cwd: `${NEXSS_SRC_PATH}`,
        stdio: "inherit",
      });
      success(`Nexss PROGRAMMER changed to tag: ${tag}`);
    } catch (er) {
      error(`There was an error during change Nexss PROGRAMMER to ${tag}`);
      console.error(er);
      process.exit();
    }
  } else {
    console.log(
      `You can only use this function when ${bold(
        "git clone"
      )} command or standard installer was used.`
    );
    console.log(
      `If you have used for installation the ${bold(
        "npm i @nexssp/cli -g"
      )}, then use npm commands to update or change versions.`
    );
    process.exit();
  }
};
