module.exports = (data) => {
  if (data.nxsStop) {
    r = 0;
    if (data.nxsStopReason) {
      console.log(
        `Nexss Programmer execution stopped by command ${bold(
          'nxsStop'
        )}. \n  Reason: ${bold(red(JSON.stringify(data.nxsStopReason)))}`
      );

      r = 1;
    }

    if (process.nxsTime) {
      const { timeElapsed } = require('../output/nxsTime');
      timeElapsed(process.nxsTime);
    }
    process.exit(0);
    // process.exit(r);
  }
};
