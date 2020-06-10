const { diffString, diff } = require("json-diff");
// I am aware that using global process is not best but for now is ok.
// TODO: change global process later
module.exports = (data) => {
  if (data["nxsDebug"]) {
    console.error("==================================================");
    if (process.nexssCMD) console.error("COMMAND: ", process.nexssCMD);
    console.error("CURRENT DIR", process.nexssCWD);
    if (process.previousDATA) {
      if (data["nxsDebug"] !== "nodiff") {
        if (typeof data["nxsDebug"] !== "boolean") {
          // displays __old, __new
          console.error(diffString(process.previousDATA, data));
        } else {
          // displays +, i colorized output
          console.error(diff(process.previousDATA, data));
        }
      } else {
        console.error(data);
      }
    } else {
      console.error(data);
    }

    process.previousDATA = data;
  }
};
