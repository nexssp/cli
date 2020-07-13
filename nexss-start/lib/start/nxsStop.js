module.exports = (data) => {
  if (data.nxsStop) {
    const cliArgs = require("minimist")(process.argv);
    const { bold } = require("../../../lib/color");
    if (cliArgs.nxsDebug) {
      console.log(
        `Nexss Programmer execution stopped by command ${bold("nxsStop")}.`
      );
    }

    if (data.nxsTime) {
      const {
        timeElapsed,
      } = require("../../../nexss-start/lib/output/nxsTime");
      timeElapsed(data.nxsTime);
    }
    process.exit(0);
  }
};
