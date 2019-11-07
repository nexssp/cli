const execSync = require("child_process").execSync;
const { bold, blue, green } = require("./color");
const { error, warn, info, success } = require("./log");
const { EOL } = require("os");
// let paramNumber = 2;
// if (process.argv[2] === "s" || process.argv[2] === "start") {
//   paramNumber = 3;
// }

const cliArgs = require("minimist")(process.argv);

const platform = process.platform;
const which = platform === "win32" ? "where" : "which";

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

  const path = module.exports.which(pkg);
  if (!path) {
    warn(`${pkg} has not been found. Installing..`);
    console.log(
      green(
        `BY INSTALLING YOU AGREE LICENSE OF '${pkg}'. 
YOU CAN CHECK LANGUAGES URLS BY COMMAND 'nexss language list'`
      )
    );
    try {
      execSync(
        installCommand.replace("<package>", pkg).replace("<module>", pkg),
        { stdio: "inherit" }
      );
      success(`${pkg} has been installed.`);
    } catch (er) {
      error(`There was an issue with the command ${installCommand}`);
      throw Error(er);
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

module.exports.which = cmd(which);
module.exports.ensureInstalled = ensureInstalled;

// ensureInstalled("sed", "scoop install sed");
