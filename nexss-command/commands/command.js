const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
const { loadConfigContent } = require("../../lib/config");
let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);
const { bold } = require("../../lib/color");

const { spawn } = require("child_process");
const { listCommands } = require("../lib/commands");
if (!configContent) {
  console.log(`You are not in the ${bold("Nexss Programmer")} project folder.`);
  process.exit(1);
}

// Setup commands names as default is run the command.
if (["add", "delete", "list"].includes(process.argv[3])) {
  require(`./${process.argv[3]}.js`);
}

// Find command in the config by the name
const CommandToRun = configContent.findByProp(
  "commands",
  "name",
  process.argv[3]
);

if (CommandToRun) {
  // We get the first command for spawn
  const commandArray = CommandToRun.command.split(" ");
  let commandToRun = commandArray[0];
  commandArray.shift();

  // Execute command and display in the stdio
  spawn(commandToRun, commandArray, {
    stdio: "inherit",
    shell: true
  });
} else {
  if (require("fs").existsSync("")) {
    require("./");
  }
  listCommands();
}
