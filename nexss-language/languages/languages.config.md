# Nexss Languages Config

All languages related repositories are located <https://github.com/nexssp/cli/blob/master/nexss-language/repos.dev.json>
and are installed automatically when needed/on demand.

## Example config file (windows)

```js
let languageConfig = Object.assign({}, require("../config.win32"));
languageConfig.title = "NodeJS";
languageConfig.description =
  "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.";
languageConfig.url = "https://nodejs.org";
languageConfig.extensions = [".js"];
languageConfig.run = "node -e";
languageConfig.printCommandLine = "node -p"; //no console.log() needed to display result eg node -p "4+6"
languageConfig.checkSyntax = "node -c";
languageConfig.interactiveShell = "node";
languageConfig.builders = {
  pkg: {
    install: "npm install -g pkg",
    command: "pkg",
    //build: "pkg --output <destinationFile> --out-path <destinationPath> <file>",
    build: "pkg",
    args: "--target host --output <destinationFile> <file>",
    help: ``,
  },
};
languageConfig.compilers = {
  node: {
    install: "scoop install node",
    // Cpp does not have possibility to compile and run on the fly. We need to save it as a exe file first.
    command: "node",
    args: "<file>",
    help: ``,
  },
};
languageConfig.errors = require("./nexss.nodejs.errors");
languageConfig.languagePackageManagers = {
  npm: {
    installation: "installed.",
    messageAfterInstallation: null, // sometimes there is need of add something to the files can be add here eg php for composer.
    installed: "npm list",
    search: "npm search",
    install: "npm install",
    uninstall: "npm remove",
    help: "npm help",
    version: "npm --version",
    init: () => {
      if (
        !require("fs").existsSync(
          require("path").join(process.cwd(), "package.json")
        )
      ) {
        require("child_process").execSync("npm init -y", { stdio: "inherit" });
        console.log("initialized npm project.");
      } else {
        console.log("npm already initialized.");
      }
    },
    // if command not found in specification
    // run directly on package manager
    else: "npm <default> <args>",
  },
  yarn: {
    installation: "scoop install yarn",
    list: "yarn list",
    search: "yarn search",
    install: "yarn list",
    uninstall: "yarn remove",
    help: "yarn help",
    version: "yarn help",
  },
};

module.exports = languageConfig;
```
