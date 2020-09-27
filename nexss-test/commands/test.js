const { bright, exe, camelCase } = require("../lib/lib");
const {
  yellow,
  green,
  red,
  bold,
  purple,
  grey,
  blue,
  magenta,
} = require("@nexssp/ansi");
const { error, warn, ok } = require("@nexssp/logdebug");
const fs = require("fs");
const path = require("path");
const nexssConfig = require("../../lib/config").loadConfigContent();
const cliArgs = require("minimist")(process.argv.slice(3));
const testType = cliArgs._.shift();
// TODO: below needs to be rewritten, done in rush
const out = (...txt) => (cliArgs.onlyErrors ? "" : console.log(...txt));
let nexssTestsPath = "./";
let nexssTestsFolder = `${__dirname}/../../tests`;
if (nexssConfig && nexssConfig.filePath) {
  nexssTestsPath = path.dirname(nexssConfig.filePath);
  nexssTestsFolder = `${nexssTestsPath}/test.nexss`;
  if (!fs.existsSync(nexssTestsFolder)) {
    console.error(`No available tests for this project..`);
    process.exit(0);
  }
}

const availTests = (testsPath) => {
  if (!testsPath) testsPath = nexssTestsFolder;
  if (!fs.existsSync(testsPath)) {
    if (nexssConfig) {
      warn(`No available tests for this project.`);
      process.exit();
    }
  }
  tests = fs.readdirSync(testsPath);
  tests.forEach((test) => {
    const e = test.split(".");
    if (e.pop() !== "js") {
      return;
    }
    out(bold(e.shift()), ...e);
  });
  process.exit();
};

if (!testType) {
  // We check location of the config file as in that folder there is a test.nexss folder with the tests..

  if (nexssConfig) {
    out(`You are in the Nexss Programmer Project. `);
    if (fs.existsSync(nexssTestsFolder)) {
      out(`Tests Folder: ${bold(path.normalize(nexssTestsFolder))}`);
      availTests(nexssTestsFolder);
      process.exit();
    } else {
      warn("No available tests for this project.");
    }
  } else {
    out(green("Available global tests:"));
    availTests();
  }

  console.error(
    `${bold("nexss test all")} OR ${bold("nexss test [testname]")}`
  );
  process.exit();
}
let testName;

if (testType !== "all") {
  const oneTest = `${testType}.nexss-test.js`;
  if (!fs.existsSync(`${nexssTestsFolder}/${oneTest}`)) {
    warn(`Test ${bold(oneTest)} does not exist`);
    availTests(nexssTestsFolder);
    process.exit();
  }
  testNames = [oneTest];
} else {
  testNames = fs.readdirSync(nexssTestsFolder);

  warn(
    `Please notice that languages.nexss-test.js needs to be run separately (not included in the 'all' tests) as it is long test which installs all environments etc and test all languages.`
  );

  testNames = testNames.filter(
    (e) =>
      e.indexOf("languages.nexss-test.js") && e.indexOf("nexss-test.js") >= 1
  );
}

var tests = 0;
var continuue = 0;
var totalPerformedTests = 0;
ok("Starting tests.. Please wait.. (no output)");
let selected = [];

if (cliArgs._.length > 0) {
  selected = cliArgs._;
  warn("You have selected tests: ", selected.join(","));
}
testNames.forEach((test) => {
  test = `${nexssTestsFolder}/${test}`;
  if (!fs.existsSync(test)) {
    warn(`Test '${bold(testName)}' does not exist.`);
    availTests(nexssTestsFolder);
    process.exit();
  }
  out(blue(`STARTING ${test}`));

  const testsDef = require(test);
  const startFrom = selected.length > 0 ? null : testsDef.startFrom;
  const endsWith = selected.length > 0 ? null : testsDef.endsWith;
  const omit = selected.length > 0 ? null : testsDef.omit;

  // const lang = JSON.parse(exe("nexss py info --json"));
  // console.log(lang.title);
  // process.exit(1);
  const tempFolder = require("os").tmpdir();
  const testFolderName = `Nexss-test-${Math.random()
    .toString(36)
    .substring(7)}`;
  const testPath = path.join(tempFolder, testFolderName);

  if (!fs.existsSync(testPath)) {
    fs.mkdirSync(testPath);
  }
  out(`Temp Folder Destination: ${testPath}`);
  process.chdir(testPath);

  global.currentExtension = null;

  if (!testsDef.values) {
    testsDef.values = ["Nexss"];
  }

  if (selected.length > 0) {
    testsDef.values = selected;
  }

  testsDef.values.forEach((ext) => {
    global.currentExtension = ext;

    out("===========================================================");
    if (ext !== "Nexss") out(yellow(`Testing \x1b[1m${bright(ext)}\x1b[0m`));

    if (continuue || ext === startFrom || !startFrom) {
      continuue = 1;

      if (omit && omit.includes(ext)) {
        out(`\x1b[1m${bright(ext)} Ommitted\x1b[0m`);
        continuue = 1;
        return;
      }

      testsDef.tests.forEach((test) => {
        // out(bold(blue(`TEST: ${test.title}`)));

        if (test.chdir) {
          out(`Changing global subdir to: ${test.chdir}`);
          process.chdir(test.chdir);
        }

        test.tests.forEach((subtest) => {
          if (test.notEval && !subtest.notEval) {
            subtest.notEval = test.notEval;
          }
          tests++;
          if (cliArgs.startFromTest) {
            if (isNaN(cliArgs.startFromTest)) {
              console.error(
                `Parameter --startFromNo must be a number, but it is '${cliArgs.startFromTest}'`
              );
              process.exit(0);
            }

            if (cliArgs.startFromTest > tests) {
              return;
            }
          }

          out("===========================================");
          out(
            yellow(bright(`TEST ${tests}`)),
            subtest.title.indexOf("$") === -1
              ? subtest.title
              : yellow(evalTS(subtest.title))
          );

          out(`===========================================`);

          eval(subtest.type || "shouldContain")(
            ...subtest.params.map((p) => {
              if ((p !== null && typeof p === "object") || subtest.notEval) {
                return p;
              } else {
                return evalTS(p);
              }
            })
          );

          totalPerformedTests++;
        });
      });

      if (endsWith && endsWith.includes(ext)) {
        out(yellow(`End`));
        process.exit(1);
        return;
      }
    }
  });
});

function evalTS(v) {
  var ext = global.currentExtension;
  return eval("`" + v + "`");
}

console.log(yellow(`done! Total ${totalPerformedTests} tests.`));

function shouldNotContain(test, regE, options) {
  should(arguments.callee.name, test, regE, options);
}

function shouldContain(test, regE, options) {
  should(arguments.callee.name, test, regE, options);
}

function should(fname, test, regE, options) {
  // TODO: To rewrite it, now works
  if (options && options.chdir) {
    out(`Changing Dir to: ${options.chdir}`);
    process.chdir(options.chdir);
  }

  if (test == "null") {
    //YES NULL as STRING
    if (!process.testData) {
      console.error("You need to specify REGEXP or STRING for the first test.");
      process.exit();
    }
    out(
      grey(`Using cached result of previous command: ${bold(process.testTest)}`)
    );
    data = process.testData;
  } else {
    process.testTest = test;
    out(`${red(bright(test))} `);
    // data = process.testData = exe(test);
    // We make sure there are no terminal colors signs as tests fails..
    data = process.testData = exe(test).replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ""
    );
  }

  // out("return: ", test, data);

  out(`>>> ${camelCase(fname)}: ${bright(green(regE))}`);
  let result, result2, result3, match;
  // out(data);
  if (data) {
    data = data.trim();
    if (regE instanceof RegExp) {
      result3 = regE.test(data);
    } else {
      let regExp = new RegExp(regE, "i");
      match = regExp.exec(data);
      result = match && match.length > 1;
      result2 = data && data.includes(regE);
    }
  }

  let title = "contains";
  if (fname === "shouldNotContain") {
    result = match && !result;
    result2 = !result2;
    result3 = !result3;
  }

  // out("Results: ", result, result2, result3);

  // out(result);
  // out(result2);
  if (result && !regE instanceof RegExp) {
    out(magenta(bright("TEST OK!\n")));
    // console.error(yellow(data));
    return match;
  } else if (result2 && !(regE instanceof RegExp)) {
    out(magenta(bright("TEST OK!\n")));
    // console.error(yellow(data));
    return data;
  } else if (result3) {
    out(magenta(bright("TEST OK!\n")));
    // console.error(yellow(data));
    return data;
  }

  console.error(
    red(bright(`=======================================================`))
  );

  // Highlight the string which should not be there
  if (fname === "shouldNotContain") {
    data = data.replace(regE, bold(purple(regE)));
  }

  if (!data) {
    console.error(red(bright(`But is empty.`)));
    console.error(
      `Maybe try run the function which couse the issue directly from Nexss Programmer.\n${green(
        bold(test)
      )}`
    );
  } else {
    console.error(red(bright(`But ${title}: `)));
    console.error(data);
  }
  console.error(
    red(bright(`=======================================================`))
  );
  console.error("process.cwd()", process.cwd());
  process.exit(0);
}

function test2(ext) {
  const c = `nexss randomfile${ext}`;
  out(`Test2: ${c}`);
  return c;
}
