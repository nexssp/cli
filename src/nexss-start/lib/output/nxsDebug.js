const { diffString, diff } = require("json-diff");
// const {
//   bold,
//   yellow,
//   red,
//   blue,
//   green,
//   grey,
//   magenta,
//   cyan,
//   white,
// } = require("@nexssp/ansi");
module.exports.nxsDebugTitle = (title, data, color) => {
  if (data && data["nxsDebug"]) {
    if (!color) color = "white";

    const belt = eval(color)(bold(`=`.repeat(80)));

    console.error(belt);
    console.error(eval(color)(bold(`\n->->-> ${title} \n`)));
    // console.error(belt);
  }
};

// I am aware that using global process is not best but for now is ok.
// TODO: change global process later
module.exports.nxsDebugData = (data, title, color) => {
  if (data["nxsDebug"]) {
    const totalLengthSide = (80 - title.length - 2) / 2;
    const side = "=".repeat(totalLengthSide);
    if (title === "Input") console.error("\n");
    switch (color) {
      case "red":
      case "yellow":
      case "green":
      case "blue":
      case "grey":
      case "magenta":
      case "cyan":
        console.error(eval(color)(side + ` ${title} ` + side));
        break;
      default:
        console.error(side + ` ${title} ` + side);
        break;
    }

    // if (process.nexssCMD) console.error(yellow("COMMAND: " + process.nexssCMD));

    if (process.previousDATA) {
      if (data["nxsDebug"] !== "nodiff") {
        if (typeof data["nxsDebug"] !== "boolean") {
          // displays __old, __new
          diffData = diffString(process.previousDATA, data);
        } else {
          // displays +, i colorized output
          diffData = diff(process.previousDATA, data);
        }
      } else {
        diffData = data;
      }
    } else {
      diffData = data;
    }

    if (diffData) {
      console.error(diffData);
    } else {
      console.error(grey("Data not changed."));
    }
    console.error(
      grey(
        bold("CURRENT DIR: ") +
          (process.nexssCWD ? process.nexssCWD : process.cwd())
      )
    );
    process.previousDATA = data;
  }
};
