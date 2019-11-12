const fs = require("fs");
// Display default commands
const { NEXSS_SRC_PATH } = require("../config/config.js");
const { bold } = require("../lib/color");
const { invert } = require("../lib/helper");
const aliases = invert(require("../aliases.json"));
const os = require("os");
// console.log(path.dirname(path.dirname(process.execPath)));
(async () => {
  const EOL = require("os").EOL;
  let entries = await fs.promises.readdir(NEXSS_SRC_PATH, {
    withFileTypes: true
  });

  entries = entries.filter(
    entry => entry.isDirectory() && entry.name.indexOf("nexss-") === 0
  );

  let commandsHelp = await Promise.all(
    entries.map(async entry => {
      const commands = await fs.promises.readdir(
        `${NEXSS_SRC_PATH}/${entry.name}/commands/`
      );
      let commandAliases = {};
      if (fs.existsSync(`${NEXSS_SRC_PATH}/${entry.name}/aliases.json`)) {
        commandAliases = invert(
          require(`${NEXSS_SRC_PATH}/${entry.name}/aliases.json`)
        );
      }

      // console.log(entries);
      // process.exit(1);

      return Promise.all(
        commands
          .filter(c => c.indexOf(".md") < 0)
          .map(async command => {
            // const shortHelp = require(`${NEXSS_SRC_PATH}/${
            //   entry.name
            // }/commands/${command.replace(".js", "-help.js")}`).shortHelp;

            const helpContent = require("fs")
              .readFileSync(
                `${NEXSS_SRC_PATH}/${entry.name}/commands/${command.replace(
                  ".js",
                  ".md"
                )}`
              )
              .toString()
              .split("\n");

            // const helpContent = require(`${NEXSS_SRC_PATH}/${entry.name}/nexssPlugin.js`)
            //   .description;
            // console.info(helpContent.toString());

            //We display 3rd or 1st line from help. Eg 1st can be just header as proper md file
            const cmd = command.replace(/\.js/, "");
            let cmdDisplay = cmd;
            if (commandAliases[cmd]) {
              cmdDisplay = `${cmd}|${commandAliases[cmd]}`;
            }
            let plugin = entry.name.split(/\-/)[1];
            let pluginDisplay = plugin;
            if (aliases[plugin]) {
              pluginDisplay = `${plugin}|${aliases[plugin]}`;
            }

            if (cmdDisplay === ".gitkeep") {
              cmdDisplay = "";
            }

            let commandHelp =
              cmd !== plugin
                ? `nexss ${pluginDisplay} ${cmdDisplay}` //[args]
                : `nexss ${pluginDisplay}`;

            return `${commandHelp} - ${helpContent[2] || helpContent[0]}`;
          })
      );
    })
  );

  console.log(
    `                ____                                                              
|..          | |             \`\`..      ..''             ..''''             ..'''' 
|  \`\`..      | |______           \`\`..''              .''                .''       
|      \`\`..  | |                 ..'\`..           ..'                ..'          
|          \`\`| |___________  ..''      \`\`.. ....''             ....''             
Programmer ${require("../package.json").version}, NodeJS ${
      process.version
    }, OS: ${process.platform} ${os.release()}  `
  );
  console.log(commandsHelp.flat());

  //   console.log(JSON.stringify(result));
})().catch(e => console.error(e));

// await fs.promises.mkdir("/tmp/a/apple", { recursive: true });
