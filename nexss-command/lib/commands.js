const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
const { loadConfigContent } = require("../../lib/config");
let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
const { red, yellow, bold, blue } = require("../../lib/color");

function listCommands() {
  const commands = configContent.commands;
  if (!commands) {
    console.log(
      red(`No available commands. (use eg. nexss cmd add *name* ls -l)`)
    );
    process.exit(0);
  }
  console.log(
    blue(
      `Available predefined commands in _nexss.yml: (usage: nexss cmd *name*)`
    )
  );
  commands.map(e =>
    console.log(`${bold(e.name)} - ${yellow(bold(e.command))}`)
  );
}

module.exports.listCommands = listCommands;
