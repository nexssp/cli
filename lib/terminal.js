const execSync = require("child_process").execSync;
const { bold, blue, green } = require("./color");
const { error, warn, info, success } = require("./log");
// const { EOL } = require("os");
const EOL = "\n";
// let paramNumber = 2;
// if (process.argv[2] === "s" || process.argv[2] === "start") {
//   paramNumber = 3;
// }

const cliArgs = require("minimist")(process.argv);

const platform = process.platform;
const which = platform === "win32" ? "cmd /c where" : "which";

const cmd = command => {
  return what => {
    try {
      return execSync(`${command} ${what}`)
        .toString()
        .trim();
    } catch (error) {
      //console.log(error);
      return false;
    }
  };
};

const ensureInstalled = (pkg, installCommand) => {
  if ((pkg && pkg.indexOf("installed") === 0) || !pkg) return;

  if (require("path").isAbsolute(pkg) && require("fs").existsSync(pkg)) {
    return pkg;
  }

  const path = module.exports.which(pkg);
  if (!path) {
    warn(`${pkg} has not been found. Installing..`);
    try {
      execSync(
        installCommand.replace("<package>", pkg).replace("<module>", pkg),
        { stdio: "inherit" }
      );
      success(`${pkg} has been installed.`);
    } catch (er) {
      // Scoop or Powershell Issues Needs to be fixed.
      error(`There was an issue with the command ${installCommand}`);
      if (pkg === "scoop") {
        error(
          `This is not happening often on modern systems however there was a problem with ${bold(
            "SCOOP"
          )} command and it's installation OR Powershell.`
        );
        error(
          "Please run commands Scoop or Powershell.exe. Both should display something."
        );
        error(
          "you need to make sure Powershell and Scoop is working properly."
        );
        error(
          "If you are on Windows 7 or 8.1 Please go to: https://github.com/nexssp/cli/wiki/Windows-7-or-8"
        );
        error(
          "Please check if your antivirus didn't move Powershell to the Chest: https://support.avast.com/en-us/article/Use-Antivirus-Virus-Chest"
        );
      }
      process.exit(1);
      // throw Error(er);
    }
  } else {
    // multiple can be used:
    if (cliArgs.verbose) {
      const exploded = path.split(EOL);
      if (exploded.length > 1) {
        info(
          `${bold(pkg)} has been found at multiple location(s) ${EOL}${bold(
            path
          )}${EOL}and this one is used: ${bold(blue(exploded[0]))}`
        );
      } else {
        info(
          `${bold(pkg)} has been found at the location ${bold(exploded[0])}`
        );
      }
    }
  }
};

module.exports.cmd = cmd;
module.exports.which = cmd(which);
module.exports.ensureInstalled = ensureInstalled;

// ensureInstalled("sed", "scoop install sed");
