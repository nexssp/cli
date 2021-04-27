const fs = require("../../lib/fs");

module.exports = () => {
  const ansi = require("@nexssp/ansi");
  const { readdirSync, readFileSync, existsSync } = require("fs");
  const { join } = require("path");
  console.log(ansi.blue(ansi.bold("List of quick/helper (-) functions")));

  const dir = readdirSync(__dirname);
  let cnt = 0;
  for (const f of dir) {
    cnt++;
    if (f.split(".").pop() !== "js") {
      continue;
    }
    const filename = f.replace(/.js$/, ".md");
    const file = join(__dirname, filename);
    if (existsSync(file)) {
      console.log(
        ansi.bold(ansi.yellow(filename)),
        "-",
        readFileSync(file).toString().split("\n")[2]
      );
    } else {
      console.log(ansi.green(filename));
    }
  }
};
