const { bold, green } = require("../../lib/color");

module.exports.installPackages = (destinationFolder) => {
  try {
    const repos = require("../repos.dev.json");
    // console.log(repos);
    for (var key in repos) {
      const command = `git clone --depth=1 --recurse-submodules ${repos[key]} ${destinationFolder}/${key}`;
      console.log(bold(green(`Installing Nexss Programmer package ${key}..`)));
      require("child_process").execSync(command, {
        stdio: "inherit",
        shell: process.platform === "win32" ? true : "/bin/bash",
      });
    }

    // Installing all dependencies in packages
    console.log(
      `${green("Nexss Packages has been downloaded.")} to ${bold(
        destinationFolder
      )}`
    );

    console.log(
      `${green("Installing packages dependencies 'nexss pkg init'")}`
    );

    require("child_process").execSync("nexss pkg init", {
      stdio: "inherit",
      shell: process.platform === "win32" ? true : "/bin/bash",
    });

    console.log(
      `${green("Nexss Packages has been installed.")} to ${bold(
        destinationFolder
      )}`
    );
  } catch (err) {
    if ((err + "").indexOf("Command failed: git clone") > -1) {
      console.error(
        `Please remove packages dir: ${bold(destinationFolder)} and try again `
      );
    } else {
      // TODO: Better handling of update etc.
      console.error(err);
    }
  }
};
