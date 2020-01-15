const { NEXSS_PROJECT_SRC_PATH } = require("../../config/config");
const { error, ok, success, info } = require("../../lib/log");
const { yellow, green, bold } = require("../../lib/color");
const fs = require("fs");
module.exports.extraFunctions = templatePath => {
  // Extra operation for the template like installations, files copy, info
  if (fs.existsSync(`${templatePath}.js`)) {
    console.log("Additional files and commands for this file. Please wait..");
    const extraOptions = require(`${templatePath}.js`);
    const files = extraOptions.files || [];
    const path = require("path");
    files.forEach(element => {
      const elementPath = path.join(path.dirname(templatePath), element);
      const destinationPath = NEXSS_PROJECT_SRC_PATH
        ? path.join(NEXSS_PROJECT_SRC_PATH, path.dirname(element))
        : path.dirname(element);

      //If we are in the project folder make a copy to the src/ of that project
      info(
        yellow(
          bold(
            `Copying 3rdParty libraries... 
${elementPath} TO 
${
  NEXSS_PROJECT_SRC_PATH ? path.join(NEXSS_PROJECT_SRC_PATH, element) : element
}`
          )
        )
      );
      const fse = require("fs-extra");
      fse.ensureDirSync(destinationPath);
      fse.copySync(
        elementPath,
        path.join(destinationPath, path.basename(element))
      );
      success("copied.");
    });

    const descriptions = extraOptions.descriptions || [];
    if (descriptions.length > 0) {
      // warn("Some information about installed packages.");
      descriptions.forEach(desc => {
        info(bold("Info from additional third party libraries package:"));
        info(desc);
      });
    }
    let commands = extraOptions.commands;

    if (commands && commands.forEach) {
      // FIXME: to check this part!!
      commands.forEach(cmd => {
        // TODO: better error handling
        // console.log(cmd);
        if (cmd) {
          const cp = require("child_process").execSync(`${cmd}`, {
            stdio: "inherit"
          });
        }
      });
    }
  }
};
