module.exports.timeElapsed = (hrTime, title = "Execution time (hr)") => {
  if (hrTime) {
    const hrend = process.hrtime(hrTime);
    let color = "\x1b[100m"; //grey

    console.error(
      `${color} ${title}: %ds %dms\x1b[0m`,
      hrend[0],
      hrend[1] / 1000000
    );
  }
};
