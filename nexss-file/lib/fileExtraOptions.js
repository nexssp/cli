const { NEXSS_PROJECT_SRC_PATH } = require("../../config/config");
const { error, success, info, ok } = require("../../lib/log");
const { yellow, red, bold } = require("../../lib/color");
const { which } = require("../../lib/terminal");
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

    let commands = extraOptions.commands;

    if (commands && commands.forEach) {
      // FIXME: to check this part!!
      commands.forEach(cmd => {
        // TODO: better error handling
        // console.log(cmd);
        if (cmd) {
          try {
            require("child_process").execSync(`${cmd}`, {
              stdio: "inherit"
            });
          } catch (err) {
            error("==========================================================");
            error(
              bold(`There was an issue with the command: ${red(cmd)}, details:`)
            );

            const commandRun = cmd.split(" ").shift();
            if (!which(commandRun)) {
              error(red(`${commandRun} seems to be not installed.`));
              error(
                red(`Error during execute extra operations: ${templatePath}.js`)
              );
            } else {
              ok(
                bold(
                  `${commandRun} seems to be installed however there may be more errors:`
                )
              );
              error(err);
              error(
                "=========================================================="
              );
            }

            process.exit();
          }
        }
      });
    }

    const descriptions = extraOptions.descriptions || [];
    if (descriptions.length > 0) {
      // warn("Some information about installed packages.");
      descriptions.forEach(desc => {
        info(bold("Info from additional third party libraries package:"));
        info(desc);
      });
    }
  }
};
