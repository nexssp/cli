const fs = require("fs");
// const dirTree = require("directory-tree");
const {
  NEXSS_PACKAGES_PATH,
  NEXSS_PROJECT_CONFIG_PATH
} = require("../../config/config");
const { error, success, warn } = require("../../lib/log");
const { loadConfigContent, saveConfigContent } = require("../../lib/config");
const packagesPath = `${NEXSS_PACKAGES_PATH}`;

const authors = fs.readdirSync(packagesPath);
const cliArgs = require("minimist")(process.argv.slice(4));

if (cliArgs._.length === 0) {
  error(
    "Enter package name `nexss pkg add myPackageName`. To see list of packages please use `nexss pkg l`"
  );
  process.exit(1);
}

const packageName = cliArgs._[0];

if (!fs.existsSync(`${NEXSS_PACKAGES_PATH}/${packageName}`)) {
  error(`Package '${packageName}' does not exist.`);
  process.exit(1);
}

// without passing a name we use source name
let destinationName = packageName;
if (cliArgs._.length > 1) {
  destinationName = cliArgs._[1];
}

if (fs.existsSync(destinationName) && !cliArgs.forceNexss) {
  error(
    "Destination folder exists. If you would like to  overwrite the folder please use --forceNexss option."
  );
  process.exit(0);
}

delete cliArgs._;
let saveNexss = cliArgs["saveNexss"];
let copyPackage = cliArgs["copyPackage"];

delete cliArgs["saveNexss"];
delete cliArgs["forceNexss"];
delete cliArgs["copyPackage"];
let params = "";
Object.keys(cliArgs).forEach(element => {
  params += ` -${element}=${cliArgs[element]}`;
});

if (copyPackage) {
  const fse = require("fs-extra");

  try {
    fse.ensureDirSync(destinationName);
    fse.copySync(`${NEXSS_PACKAGES_PATH}/${packageName}`, `${destinationName}`);
    success(
      `Package has been copied: '${NEXSS_PACKAGES_PATH}/${packageName}' to ${destinationName}`
    );
  } catch (er) {
    error(er);
    error("There was an error during copy/creation package.");
  }
}

if (saveNexss) {
  let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
  if (configContent) {
    configContent.push("files", { name: destinationName + params });
    saveConfigContent(configContent, NEXSS_PROJECT_CONFIG_PATH);
    success("Configuration saved.");
  }
} else {
  warn(
    "Package has been not added to _nexss.yml. Please add it manually or add it with --saveNexss option."
  );
  warn(`Please add this to the files as: ${destinationName + params}`);
}
