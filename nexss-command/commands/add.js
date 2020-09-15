const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");

const { loadConfigContent, saveConfigContent } = require("../../lib/config");
const { success, warn, error, info } = require("../../lib/log");
let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

const commandName = process.argv[4];
const commandToAdd = process.argv.slice(5).join(" ");

const { green } = require("../../lib/ansi");

if (!process.argv[4]) {
  error("Please enter command name.");
  process.exit();
}

if (!commandToAdd) {
  error("Please enter command body eg. nexss c add listFiles ls -la.");
  process.exit();
}

console.log(green(`Adding command '${process.argv[4]}' as '${commandToAdd}'`));

// const bannedCommands = ["add", "command", "delete", "list"];

// if (bannedCommands.includes(commandName)) {
//   warn(`You cannot use ${bannedCommands} as command name.`);
//   return;
// }
if (configContent.findByProp("commands", "name", commandName)) {
  warn(`Command '${commandName}' is already in the config file _nexss.yml`);

  return;
} else {
  configContent.push("commands", { name: commandName, command: commandToAdd });
  saveConfigContent(configContent, NEXSS_PROJECT_CONFIG_PATH);
  success("Done..");
}

process.exit(0);
