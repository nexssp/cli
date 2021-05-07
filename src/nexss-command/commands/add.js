const { loadConfigContent, saveConfigContent } = require("../../lib/config");
let configContent = loadConfigContent(process.env.NEXSS_PROJECT_CONFIG_PATH);

const commandName = process.argv[4];

const commandNamesBlocked = ["add", "delete", "list"];
if (commandNamesBlocked.includes(commandName)) {
  log.error(
    `You cannot use command names: ${commandNamesBlocked.join(
      ", "
    )} as they are used by command itself.`
  );
  process.exit(1);
}

process.argv = process.argv.filter(
  (e) => e !== "--nxsPipeErrors" && e !== nexss["error:pipe"]
);

const commandToAdd = process.argv.slice(5).join(" ");

if (!commandName) {
  log.error("Please enter command name.");
  process.exit();
}

if (!commandToAdd) {
  log.error("Please enter command body eg. nexss c add listFiles ls -la.");
  process.exit();
}

// We remove --nxsPipeErrors as there are added during testing

console.log(green(`Adding command '${commandName}' as '${commandToAdd}'`));

// const bannedCommands = ["add", "command", "delete", "list"];

// if (bannedCommands.includes(commandName)) {
//   log.warn(`You cannot use ${bannedCommands} as command name.`);
//   return;
// }

if (configContent.findByProp("commands", "name", commandName)) {
  log.warn(`Command '${commandName}' is already in the config file _nexss.yml`);

  return;
} else {
  if (!configContent.commands) {
    configContent.commands = [];
  }

  configContent.commands.push({ name: commandName, command: commandToAdd });

  saveConfigContent(configContent, process.env.NEXSS_PROJECT_CONFIG_PATH);
  log.success("Done..");
}

process.exit(0);
