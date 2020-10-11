const ansi = require("@nexssp/ansi");
module.exports = () => {
  let result = "";
  result += bold(yellow("Constants:\n"));
  let x = 0;
  for (let constant of global.nConstants) {
    const color = ansi.colors[x];

    result += `${ansi[color](constant)}` + ", ";
    x++;
  }
  process.stdout.write(result + "\n");
};
