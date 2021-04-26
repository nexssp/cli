const { error, success, info, ok } = require("@nexssp/logdebug");
const { which } = require("../../lib/terminal");

module.exports.extraFunctions = (templatePath) => {
  // Extra operation for the template like installations, files copy, info
  if (fs.existsSync(`${templatePath}.js`)) {
    console.log("Additional files and commands for this file. Please wait..");
    const extraOptions = require(`${templatePath}.js`);
    const files = extraOptions.files || [];
    const path = require("path");
    files.forEach((element) => {
      const elementPath = path.join(path.dirname(templatePath), element);
      const destinationPath = process.env.NEXSS_PROJECT_SRC_PATH
        ? path.join(process.env.NEXSS_PROJECT_SRC_PATH, path.dirname(element))
        : path.dirname(element);

      //If we are in the project folder make a copy to the src/ of that project
      info(
        yellow(
          bold(
            `Copying 3rdParty libraries... 
${elementPath} TO 
${destinationPath}`
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
      // const distName = dist();

      // TODO: Later to cleanup this config file !!
      // switch (distName) {
      //   default:
      //     languageConfig.compilers.ruby.install = replaceCommandByDist(
      //       languageConfig.compilers.ruby.install
      //     );
      //     break;
      // }

      // FIXME: to check this part!!
      let defaultOptions = { stdio: "inherit" };
      if (process.platform === "win32") {
        defaultOptions.shell = true;
      } else {
        defaultOptions.shell = process.shell;
      }

      commands.forEach((cmd2) => {
        // TODO: better error handling
        // console.log(cmd);
        cmd = process.replacePMByDistro(cmd2);
        if (cmd) {
          if (!process.argv.includes("--progress")) {
            log.info("To see all installation messages use --progress.");
            defaultOptions.stdio = "pipe";
          }

          try {
            require("child_process").execSync(`${cmd}`, defaultOptions);
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
              error(err.stderr ? err.stderr : err);
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
      descriptions.forEach((desc) => {
        info(bold("Info from additional third party libraries package:"));
        info(desc);
      });
    }
  }
};
