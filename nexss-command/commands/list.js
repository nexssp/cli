const { green, yellow, bold } = require("../../lib/ansi");
const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");

const { loadConfigContent } = require("../../lib/config");
let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

listCommands();
process.exit(0);

function listCommands() {
  const commands = configContent.commands;
  if (!commands) {
    console.log(
      yellow(`No available commands. (use eg. nexss cmd add *name* ls -l)`)
    );
    return;
  }
  console.log(
    green(
      `Available predefined commands in _nexss.yml: (usage: nexss cmd *name*)`
    )
  );

  commands.map((e) =>
    console.log(`${bold(e.name)} - ${yellow(bold(e.command))}`)
  );
}
