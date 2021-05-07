module.exports.installPackages = (destinationFolder, packageName) => {
  // We make sure git is installed.
  const { ensureInstalled } = require("../../lib/terminal");
  const config = require(`../../nexss-language/languages/config.${process.platform}`);
  const osPM =
    config.osPackageManagers[Object.keys(config.osPackageManagers)[0]];

  ensureInstalled("git", `${osPM.installCommand} git`);

  try {
    let repos = require("../repos.json");

    if (packageName) {
      if (!repos[packageName]) {
        return false;
      }
      repos = { [packageName]: repos[packageName] };
    }

    for (var key in repos) {
      const command = `git clone --depth=1 --recurse-submodules ${repos[key]} ${destinationFolder}/${key}`;
      console.log(
        bold(green(`Installing Nexss Programmer package ${yellow(key)}..`))
      );
      require("child_process").execSync(command, {
        stdio: "inherit",
        shell: process.shell,
      });
    }

    if (packageName) {
      console.log(
        `${green(
          "Installing packages dependencies 'nexss pkg init " +
            packageName +
            "'"
        )}`
      );
      console.log(
        `${yellow(
          bold("Package " + bold(packageName) + "  has been downloaded.")
        )} to ${bold(destinationFolder)}`
      );
    } else {
      // Installing all dependencies in packages
      console.log(
        `${yellow(bold("Nexss Packages has been downloaded."))} to ${bold(
          destinationFolder
        )}`
      );
      console.log(
        `${green("Installing packages dependencies 'nexss pkg init'")}`
      );
    }

    require("child_process").execSync(
      `nexss pkg init${packageName ? " " + packageName : ""}`,
      {
        stdio: "inherit",
        shell: process.shell,
      }
    );

    if (packageName) {
      console.log(
        `${yellow(
          `>> Package ${bold(packageName)} has been installed.`
        )} to ${bold(require("path").join(destinationFolder, packageName))}`
      );
    } else {
      console.log(
        `${yellow(
          `>> All Nexss package(s) has been installed.`
        )} to ${destinationFolder}`
      );
    }
  } catch (err) {
    if ((err + "").indexOf("Command failed: git clone") > -1) {
      console.error(
        `Try to remove package(s) dir: ${bold(
          destinationFolder + (packageName ? "/" + packageName : "")
        )} and try again.`
      );
    } else {
      // TODO: Better handling of update etc.
      console.error(err);
    }
  }
};
