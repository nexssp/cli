const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");

const { loadConfigContent } = require("../../lib/config");
let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

listCommands();
process.exit(0);

function listCommands() {
  // There is platform specific commands. We use
  if (configContent.commands[process.platform]) {
    configContent.commands = configContent.commands[process.platform];
  }

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
  const os = require("@nexssp/os");
  commands.map((e) =>
    console.log(
      `${bold(e.name)} - ${yellow(bold(os.replacePMByDistro(e.command)))}`
    )
  );
}