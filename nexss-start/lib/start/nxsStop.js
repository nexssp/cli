module.exports = (data) => {
  if (data.nxsStop) {
    const cliArgs = require("minimist")(process.argv);
    const { bold, red } = require("@nexssp/ansi");
    r = 0;
    if (data.nxsStopReason) {
      console.log(
        `Nexss Programmer execution stopped by command ${bold(
          "nxsStop"
        )}. \n  Reason: ${bold(red(JSON.stringify(data.nxsStopReason)))}`
      );

      r = 1;
    }

    if (data.nxsTime) {
      const {
        timeElapsed,
      } = require("../../../nexss-start/lib/output/nxsTime");
      timeElapsed(data.nxsTime);
    }
    process.exit(0);
    // process.exit(r);
  }
};
