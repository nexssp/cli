module.exports = () => {
  const { NEXSS_SRC_PATH } = require("../../config/config");
  const { success, error } = require("../../lib/log");
  const tag = process.argv[3];
  try {
    require("child_process").execSync(`git checkout ${tag}`, {
      cwd: `${NEXSS_SRC_PATH}`,
      stdio: "inherit",
    });
    success(`Nexss changed to tag: ${tag}`);
  } catch (er) {
    error(`There was an error during change to ${tag}`);
    console.error(er);
    process.exit();
  }
};
