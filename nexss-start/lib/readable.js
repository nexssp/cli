const { Readable } = require("stream");
const fs = require("../../lib/fs");
const { info, error } = require("../../lib/log");

let paramNumber = 2;
if (process.argv[2] === "s" || process.argv[2] === "start") {
  paramNumber = 3;
}
const cliArgs = require("minimist")(process.argv.slice(paramNumber));
const { cleanup } = require("./output/nxsOutputParams");
// const nxsInModule = require("./input/nxsIn");
module.exports.readable = (startData) => {
  var s = new Readable({
    objectMode: true,
  });
  s._read = () => {};
  const nexssVersion = require("../../package.json").version;
  startData.nexss = `FREE/OPENSOURCE ${nexssVersion}`;
  startData.start = +new Date();
  startData.cwd = process.nexssGlobalCWD;

  if (cliArgs.nxsTime) {
    startData.nxsTime = process.hrtime();
  }

  // TEST DATA
  if (cliArgs.nxsTest) {
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
  let stdinRead;
  switch (process.platform) {
    case "win32":
      stdinRead = require("./stdin")[process.platform]().trim();
      break;
    default:
      stdinRead = require("./stdin")["linux"]().trim();
      break;
  }

  let dataStdin = {};
  if (stdinRead) {
    try {
      dataStdin = JSON.parse(stdinRead);
    } catch (error) {
      dataStdin.nexssStdin = stdinRead;
    }

    Object.assign(startData, dataStdin);
  }

  // console.error("NEXSS/info:", stdinRead, "end");

  const { expressionParser } = require("../lib/expressionParser");
  Object.keys(startData).forEach((e) => {
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
  cliArgsCleaned = cleanup(cliArgs);
  Object.assign(startData, cliArgsCleaned);

  // Make sure we are in the right folder.
  // Later change it
  if (require("fs").existsSync(startData.cwd) && !cliArgs)
    process.chdir(startData.cwd);
  // startData = nxsInModule(startData);

  s.push(JSON.stringify(startData));
  s.push(null);
  return s;
};
