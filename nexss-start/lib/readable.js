// const nxsInModule = require("./input/nxsIn");
module.exports.readable = (startData) => {
  const { Readable } = require("stream");
  const fs = require("../../lib/fs");
  const { info, error } = require("@nexssp/logdebug");

  let paramNumber = 2;
  if (process.argv[2] === "s" || process.argv[2] === "start") {
    paramNumber = 3;
  }
  const cliArgs = require("minimist")(process.argv.slice(paramNumber));
  const { cleanup } = require("./output/nxsOutputParams");
  var s = new Readable({
    objectMode: true,
    highWaterMark: require("../../config/defaults").highWaterMark,
  });
  s._read = () => {};

  // if (cliArgs.nxsTime) {
  //   process.nxsTime = process.hrtime();
  // }

  // process.nxsOut = cliArgs.nxsOut;
  // delete cliArgs.nxsOut;

  if (cliArgs._ && cliArgs._.shift) {
    cliArgs._.shift();
    if (cliArgs._.length === 0) {
      delete cliArgs._;
    }
  }

  cliArgsCleaned = cleanup(cliArgs);

  const nexssVersion = require("../../package.json").version;

  startData.nexss = `${nexssVersion}`;
  startData.start = +new Date();
  startData.cwd = process.nexssGlobalCWD;

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
  // LOG stdin read
  // require("fs").appendFileSync(
  //   path.join(__dirname, "../../logs/", "stdin.log"),
  //   +new Date() + " READ: " + JSON.stringify(stdinRead, null, 2) + "\n"
  // );

  let dataStdin = {};
  if (stdinRead) {
    try {
      dataStdin = JSON.parse(stdinRead);
    } catch (er) {
      if (stdinRead.startsWith("SyntaxError: ")) {
        error(stdinRead);
        process.exitCode = 1;
        return;
      }

      dataStdin.nexssStdin = stdinRead;
    }

    Object.assign(startData, dataStdin);
    log.dm(`¦ Stream: Readable stdin is NOT empty. Parsing..`);
  } else {
    log.dm(`× Stream: Readable stdin is empty.`);
  }

  // console.error("NEXSS/info:", stdinRead, "end");

  const { expressionParser } = require("../lib/expressionParser");
  Object.keys(startData).forEach((e) => {
    startData[e] = expressionParser(startData, startData[e]);
  });

  // Remove first parameter (script name)
  // Delete empty _
  // if (cliArgs._ && cliArgs._.shift) {
  //   cliArgs._.shift();
  //   if (cliArgs._.length === 0) {
  //     delete cliArgs._;
  //   }
  // }
  if (cliArgs._) {
    cliArgs.nxsIn = cliArgs._;
    delete cliArgs._;
  }

  // cliArgsCleaned = cleanup(cliArgs);
  log.dc(bold(`  Adding cliArgs: Stream: Readable..`), cliArgsCleaned);
  Object.assign(startData, cliArgsCleaned);
  // Make sure we are in the right folder.
  // Later change it
  // if (require("fs").existsSync(startData.cwd) && !cliArgs)
  //   process.chdir(startData.cwd);
  // startData = nxsInModule(startData);
  if (process.NexssFilePath && process.NexssFilePath !== ".") {
    // data.__dirname = process.NexssFilePath;
    if (!startData["__dirname"]) startData["__dirname"] = process.cwd();
    startData.cwd = process.NexssFilePath;
  }

  s.push({ from: "readable", status: "ok", data: startData });
  s.push(null);

  return s;
};
