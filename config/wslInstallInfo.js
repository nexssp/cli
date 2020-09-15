const { bold } = require("../lib/ansi");
module.exports = () => {
  console.log(`${bold("wsl")} command has not been found.`);
  console.log(
    `For this language you need to have ${bold(
      "Windows Subsystem Linux (WSL)"
    )} enabled.`
  );
  console.log(
    `More information you can find here: ${bold(
      "https://github.com/nexssp/cli/wiki/WSL-(Windows-Subsystem-Linux)"
    )}`
  );
};
