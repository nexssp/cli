const { Readable } = require("stream");
const { info, error } = require("../../lib/log");

let paramNumber = 2;
if (process.argv[2] === "s" || process.argv[2] === "start") {
  paramNumber = 3;
}
const cliArgs = require("minimist")(process.argv.slice(paramNumber));

module.exports.readable = startData => {
  var s = new Readable({
    objectMode: true
  });
  s._read = () => {};
  const nexssVersion = require("../../package.json").version;
  startData.nexss = `FREE/OPENSOURCE ${nexssVersion}`;
  startData.start = +new Date();
  startData.cwd = process.cwd();
  if (cliArgs.nxsTime) {
    startData.nxsTime = process.hrtime();
  }

  // TEST DATA
  if (cliArgs.test) {
    info("Testing enabled");
    let testDataPassed = cliArgs.testData || cliArgs.testdata;
    if (!testDataPassed) {
      testData = require("../../config/testingData.json");
    } else {
      var testDataPath = path.normalize(`${process.cwd()}/${testDataPassed}`);
      try {
        testData = require(testDataPath);
      } catch (_) {
        if (!fs.existsSync(testDataPath)) {
          error(
            `Your test data ${bold(
              testDataPath
            )} must be valid json or JavaScript/NodeJS file!`
          );
        } else {
          error(
            `Your test data ${bold(
              testDataPath
            )} must be valid json or JavaScript/NodeJS file!`
          );
        }

        process.exit();
      }
    }
    info("Testing Input Data", JSON.stringify(testData, 2));
    Object.assign(startData, testData);
  }
  // STDIN -trim just to avoid extra params from JSON
  const stdinRead = require("../lib/stdin")().trim();
  let dataStdin = {};
  if (stdinRead) {
    try {
      dataStdin = JSON.parse(stdinRead);
    } catch (error) {
      dataStdin.nexssStdin = stdinRead;
    }

    Object.assign(startData, dataStdin);
  }

  const { expressionParser } = require("../lib/expressionParser");
  Object.keys(startData).forEach(e => {
    startData[e] = expressionParser(startData, startData[e]);
  });

  // Remove first parameter (script name)
  // Delete empty _
  if (cliArgs._ && cliArgs._.shift) {
    cliArgs._.shift();
    if (cliArgs._.length === 0) {
      delete cliArgs._;
    }
  }

  delete cliArgs.nxsTime;

  Object.assign(startData, cliArgs);

  s.push(JSON.stringify(startData));
  s.push(null);
  return s;
};
