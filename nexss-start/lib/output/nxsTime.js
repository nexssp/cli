module.exports.timeElapsed = hrTime => {
  if (hrTime) {
    const hrend = process.hrtime(hrTime);
    let color = "\x1b[44m"; //green

    console.error(
      `NEXSS/info:${color} Execution time (hr): %ds %dms\x1b[0m`,
      hrend[0],
      hrend[1] / 1000000
    );
  }
};