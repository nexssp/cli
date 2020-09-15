module.exports = (data) => {
  if (data.nxsStop) {
    const cliArgs = require("minimist")(process.argv);
    const { bold, red } = require("../../../lib/color");
    r = 0;
    if (data.nxsStopReason) {
      console.log(
        `Nexss Programmer execution stopped by command ${bold(
          "nxsStop"
        )}. \n  Reason: ${bold(red(data.nxsStopReason))}`
      );
      r = 1;
    }

    if (data.nxsTime) {
      const {
        timeElapsed,
      } = require("../../../nexss-start/lib/output/nxsTime");
      timeElapsed(data.nxsTime);
    }
    process.exit(r);
  }
};
