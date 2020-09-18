const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
const { loadConfigContent } = require("../../lib/config");
let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
const { red, yellow, bold, green } = require("@nexssp/ansi");

function listCommands() {
  const commands = configContent.commands;

  if (!commands || (commands && commands.length == 0)) {
    console.log(bold(`No available commands for this package.`));
    process.exit(0);
  }
  console.log(
    bold(
      `Available predefined commands in _nexss.yml: (usage: nexss command *name*)`
    )
  );

  const Table = require("cli-table3");
  var table = new Table({
    head: [green("name"), green("command")],
  });
  commands.forEach((cmd) => {
    table.push([bold(yellow(cmd.name)), bold(cmd.command)]);
  });

  console.log(table.toString());
}

module.exports.listCommands = listCommands;
