const { NEXSS_PROJECT_CONFIG_PATH } = require("../../config/config");
const { loadConfigContent } = require("../../lib/config");
let configContent = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

const { spawn } = require("child_process");
const { listCommands } = require("../lib/commands");
if (!configContent) {
  console.log("You are not in the nexss programmer project folder.");
  process.exit(1);
}

if (["add", "delete", "list"].includes(process.argv[3])) {
  require(`./${process.argv[3]}.js`);
}

const CommandToRun = configContent.findByProp(
  "commands",
  "name",
  process.argv[3]
);

if (CommandToRun) {
  const commandArray = CommandToRun.command.split(" ");
  let commandToRun = commandArray[0];
  commandArray.shift();

  const proc = spawn(commandToRun, commandArray, {
    stdio: "inherit",
    shell: true
  });
} else {
  if (require("fs").existsSync("")) {
    require("./");
  }
  listCommands();
}
