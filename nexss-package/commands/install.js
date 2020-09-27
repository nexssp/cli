// Installs Nexss Programmer package(s)
const { installPackages } = require("../lib/install");

const packageToInstall = process.argv[4];
if (!packageToInstall) {
  console.error(
    `Enter ${blue("Nexss Programmer")} ${yellow("package name")} or ${green(
      bold("all")
    )} for all of the packages.`
  );
} else {
  const repos = require("../repos.json");

  if (packageToInstall !== "all") {
    if (!repos[packageToInstall]) {
      console.error(
        `Package ${yellow(bold(packageToInstall))} cannot be found.`
      );
    } else {
      installPackages(process.env.NEXSS_PACKAGES_PATH, packageToInstall);
    }
  } else {
    // Install all packages
    installPackages(process.env.NEXSS_PACKAGES_PATH);
  }
}
