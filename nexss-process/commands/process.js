// console.log(
//   "There is a default file (the same name as plugin - if exists then run it rather then help)"
// );
const { yellow } = require("@nexssp/ansi");
const { info } = require("../../lib/log");
const { displayProcesses } = require("../../lib/proc");
const config = require(`../../nexss-language/languages/config.${process.platform}`);

const { ensureInstalled } = require("../../lib/terminal");
const osPM = config.osPackageManagers[Object.keys(config.osPackageManagers)[0]];
ensureInstalled(
  "ps",
  `${osPM.install ? osPM.install : osPM.installCommand} procps`
);

info(yellow(`Nexss Processes`));
displayProcesses();
