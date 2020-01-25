const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
const { loadConfigContent } = require("../../lib/config");
let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
const { red, yellow, bold, green } = require("../../lib/color");

function listCommands() {
  const commands = configContent.commands;

  if (!commands || (commands && commands.length == 0)) {
    console.log(
      red(bold(`No available commands. (use eg. nexss c add *name* ls -l)`))
    );
    process.exit(0);
  }
  console.log(
    bold(
      `Available predefined commands in _nexss.yml: (usage: nexss command *name*)`
    )
  );

  const Table = require("cli-table3");
  var table = new Table({
    head: [green("name"), green("command")]
  });
  commands.forEach(cmd => {
    table.push([bold(yellow(cmd.name)), bold(cmd.command)]);
  });

  console.log(table.toString());
}

module.exports.listCommands = listCommands;
