const fs = require("fs");
// const dirTree = require("directory-tree");
const { NEXSS_LANGUAGES_PATH } = require("../../config/config");

const cliArgs = require("minimist")(process.argv);
const languages = fs.readdirSync(NEXSS_LANGUAGES_PATH);

let pkgs = [];

process.chdir(languagesDirs);
languages.forEach(langDir => {
  try {
    require("child_process").execSync(`nexss cmd init`, {
      cwd: `${packagesPath}/${author}/${pkg}/${details}`,
      stdio: "inherit"
    });
    success(`Default template cloned.`);
  } catch (er) {
    console.error(er);
    process.exit(1);
  }
});
