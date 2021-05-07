const execSync = require("child_process").execSync;

const EOL = "\n";
const platform = process.platform;
const which = platform === "win32" ? "cmd /c where" : "command -v";

const cmd = (command) => {
  return (what) => {
    try {
      return execSync(`${command} ${what}`, {
        shell: process.shell,
      })
        .toString()
        .trim();
    } catch (error) {
      //console.log(error);
      return false;
    }
  };
};

const ensureInstalled = (pkg, installCommand, options = {}) => {
  if ((pkg && pkg.indexOf("installed") === 0) || !pkg) return;

  if (require("path").isAbsolute(pkg) && require("fs").existsSync(pkg)) {
    return pkg;
  }

  let path;
  if (pkg.startsWith("wsl")) {
    const wsl = module.exports.which("wsl");
    if (!wsl) {
      const wslInfo = require("../config/wslInstallInfo");
      wslInfo();
      process.exit();
    }

    path = module.exports.checkWSLCommand(pkg.substring(4));
  } else {
    path = module.exports.which(pkg);
  }

  let defaultOptions = { stdio: "inherit" };
  if (process.platform === "win32") {
    defaultOptions.shell = true;
  } else {
    defaultOptions.shell = process.shell;
  }

  defaultOptions.maxBuffer = 10485760; // 10 * 1024 * 1024;
  if (Object.keys(options).length > 0) {
    Object.assign(defaultOptions, options);
  }

  // For Python we have some error display from Microsoft which we need to check if this is python
  if (
    !path ||
    (path.split && ~path.split("\n")[0].indexOf("WindowsApps\\python"))
  ) {
    // For other then Powershell we use && for next line commands
    let shellCommandSeparator = "&&";

    if (
      options &&
      options.shell &&
      options.shell.toLowerCase() === "powershell" // For Poweshell 5.1 is ; needed pwsh 6 is working with &&
    ) {
      shellCommandSeparator = ";";
    }

    log.info(`installing ${yellow(bold(pkg))}, please wait..`);

    if (
      !cliArgs.progress &&
      !(
        process.nexssGlobalConfig &&
        process.nexssGlobalConfig[nexss["arg:progress"]]
      )
    ) {
      log.info("To see all installation messages use --progress.");
      defaultOptions.stdio = ["ignore", "pipe", "pipe"];
    }

    if (cliArgs.nxsLearning) {
      log.info(`run: ${installCommand}`);
    }

    try {
      execSync(
        installCommand
          .replace("<package>", pkg)
          .replace("<module>", pkg)
          .split(/\r?\n/) // Added multiline commands
          .join(` ${shellCommandSeparator} `),
        defaultOptions
      );
      log.success(`${pkg} has been installed by: ${installCommand}`);
    } catch (er) {
      log.info(er.stdout ? er.stdout.toString() : "");
      log.info(er.stderr ? er.stderr.toString() : "");
      // Scoop or Powershell Issues Needs to be fixed.
      log.error(
        `There was an issue with the command:\n${bold(installCommand)}`
      );
      if (pkg === "scoop") {
        log.error(
          `This is not happening often on modern systems however there was a problem with ${bold(
            "SCOOP"
          )} command and it's installation OR Powershell.`
        );
        log.error(
          "Please run commands Scoop or Powershell.exe. Both should display something."
        );
        log.error(
          "you need to make sure Powershell and Scoop is working properly."
        );
        log.error(
          "If you are on Windows 7 or 8.1 Please go to: https://github.com/nexssp/cli/wiki/Windows-7-or-8"
        );
        log.error(
          "Please check if your antivirus didn't move Powershell to the Chest: https://support.avast.com/en-us/article/Use-Antivirus-Virus-Chest"
        );
      }
      process.exit();
      // throw Error(er);
    }
  } else {
    // multiple can be used:
    if (cliArgs.verbose && !pkg.startsWith("wsl")) {
      const exploded = path.split(EOL);
      if (exploded.length > 1) {
        log.dbg(
          `${bold(pkg)} has been found at multiple location(s) ${EOL}${bold(
            path
          )}${EOL}and this one is used: ${bold(exploded[0])}`
        );
      } else {
        log.dbg(
          `${bold(pkg)} has been found at the location ${bold(exploded[0])}`
        );
      }
    }
    return path;
  }
};
module.exports.pathWinToLinux = (p) => {
  var path = require("path");
  if (path.isAbsolute(p)) {
    return p.replace(/c\:/, "/mnt/c").replace(/\\/g, "/");
  } else {
    return `./${p}`;
  }
};

module.exports.checkWSLCommand = (command) => {
  try {
    const r = execSync(`wsl ${command}`, {
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch (error) {
    // console.log("command not found", error);
  }
};

module.exports.cleanTerminalColors = (data) =>
  data.replace
    ? data.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ""
      )
    : data;

module.exports.cmd = cmd;
module.exports.which = cmd(which);
module.exports.ensureInstalled = ensureInstalled;

// ensureInstalled("sed", "scoop install sed");
