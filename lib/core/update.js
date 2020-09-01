module.exports = () => {
  const { NEXSS_SRC_PATH } = require("../../config/config");
  const { success, error } = require("../../lib/log");
  const tag = process.argv[3];
  if(!tag){
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
};
