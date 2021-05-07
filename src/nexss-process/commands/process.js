const { displayProcesses } = require("../../lib/proc");
const config = require(`../../nexss-language/languages/config.${process.platform}`);

const { ensureInstalled } = require("../../lib/terminal");
const osPM = config.osPackageManagers[Object.keys(config.osPackageManagers)[0]];

if (process.platform !== "win32") {
  ensureInstalled(
    "ps",
    `${osPM.install ? osPM.install : osPM.installCommand} procps`
  );
}

log.info(yellow(`Nexss Processes`));
displayProcesses();
