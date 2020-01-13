// Nexss Programmer Installator
const { homedir } = require("os");
const { ensureInstalled, which } = require("../lib/terminal");
const { blue, yellow, green, bold, red } = require("../lib/color");
const { execSync } = require("child_process");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const path = require("path");
const fs = require("fs");

const installFolder = homedir() + "\\.nexss\\cli\\";
const PowerShellInstallUrl =
  "https://github.com/PowerShell/PowerShell/releases/download/v6.2.3/PowerShell-6.2.3-win-x64.msi";
const PowerShellInstallFile =
  homedir() + `\\.nexss\\${path.basename(PowerShellInstallUrl)}`;
const PowerShellGitHubRepository = "https://github.com/powershell/powershell";
// retrn = to return results
const cmd = (command, retrn, noerror) => {
  try {
    let options;
    if (!retrn) {
      options = {
        stdio: "inherit"
      };
    }
    const result = execSync(`${command}`, options);
    if (result) {
      return result.toString().trim();
    }
  } catch (error) {
    if (!noerror) console.log(error);
    return false;
  }
};

console.log(`${yellow(
  bold("Welcome to the Nexss Programmer 2.0 Installer")
)} (Windows)
- Installs latest version of Powershell (download ${path.basename(
  PowerShellInstallUrl
)})
if you have issues with Powershell please go to: ${PowerShellGitHubRepository})
- Installing ${bold(green("Scoop"))} ${bold(blue("(if not exists)"))}
- Installing ${bold(green("NodeJS"))} ${bold(blue("(if not exists)"))}
- Installing ${bold(green("Git"))} ${bold(blue("(if not exists)"))}
- Get Latest Version of ${green("Nexss Programmer")} and install it to ${bold(
  installFolder
)}`);

if (fs.existsSync(installFolder)) {
  console.log(
    bold(red("Warning: ")),
    yellow(
      bold(
        `Folder ${installFolder} does exist and if you are going to continue ${red(
          "**it will be deleted**"
        )}. But this means it will ${green(
          "**upgrade nexss programmer**"
        )} to the latest version.`
      )
    )
  );
}

rl.question(green(bold("Would you like to continue? (Y/n)")), function(YesNo) {
  if (YesNo !== "" && YesNo !== "y" && YesNo !== "Y") {
    process.exit(0);
  }

  if (!which("iex")) {
    console.error("This installer needs to be run from command line.");
    process.exit(1);
  }

  //   if (!fs.existsSync(PowerShellInstallFile)) {
  //     console.error(
  //       red(
  //         bold(`DEV ERROR:
  // Script is not included in the installer: ${PowerShellInstallFile} has not been found.`)
  //       )
  //     );
  //     console.log(`files in dir: `);
  //     fs.readdirSync(path.dirname(PowerShellInstallFile), function(err, items) {
  //       console.log(items);

  //       for (var i = 0; i < items.length; i++) {
  //         console.log(items[i]);
  //       }
  //     });

  //     process.exit(1);
  //   }

  console.log("\nInstalling Nexss Programmer 2.0..");
  console.log(
    "============================================================================="
  );

  console.log("Installing latest stable version of Powershell..");

  if (!fs.existsSync(PowerShellInstallFile)) {
    console.log(
      "Downloading Powershell installer from " + PowerShellInstallUrl
    );
    const command = `PowerShell -command "Invoke-WebRequest -Uri ${PowerShellInstallUrl} -OutFile ${PowerShellInstallFile}"`;
    cmd(command);
  }

  const InstallCommandPowershell = `msiexec.exe /package ${PowerShellInstallFile}`;
  console.log(`Execute: ${InstallCommandPowershell}`);
  cmd(InstallCommandPowershell, false, true);

  console.log(
    "Setting the rights for Poweshell.. Please wait during download and go through installation process."
  );

  var rightsPowershellCmd = `PowerShell -Command "Set-ExecutionPolicy RemoteSigned -scope CurrentUser"`;
  console.log(`Execute command: ${rightsPowershellCmd}`);
  cmd(rightsPowershellCmd);

  console.log("Installing scoop if not exists..");
  ensureInstalled(
    "scoop",
    `PowerShell -command "iex (new-object net.webclient).downloadstring('https://get.scoop.sh')"`
  );

  console.log("Adding 'extras' bucket for scoop");
  cmd("scoop bucket add extras");

  console.log("Installing node if not exists..");
  ensureInstalled("node", "scoop install node");

  console.log("Installing git if not exists..");
  ensureInstalled("git", "scoop install git");

  if (fs.existsSync(installFolder)) {
    console.log(
      `Removing previous installation of Nexss Programmer (${installFolder})`
    );
    try {
      fs.rmdirSync(installFolder);
    } catch (error) {
      console.error(
        red(
          bold(
            `Unable to delete folder ${installFolder}. Please remove it manually.`
          )
        )
      );
      process.exit(1);
    }
  }
  try {
    require("child_process").execSync(
      `git clone https://github.com/nexssp/cli.git ${installFolder} && cd ${installFolder} && npm link`,
      {
        stdio: "inherit"
      }
    );
    console.log(`Nexss Programmer has been downloaded`);
  } catch (er) {
    console.error(
      "There was an isse with downloading Nexss Programmer. Please go to: https://github.com/nexssp/cli.git"
    );
    process.exit(1);
  }

  console.log(
    "============================================================================="
  );
  console.log(
    "Nexss Programmer has been installed. Re-open your Terminal and run command 'nexss'."
  );
  console.log(
    "============================================================================="
  );
  console.log("Press any key to exit.");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", process.exit.bind(process, 0));
});
