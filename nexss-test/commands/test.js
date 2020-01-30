const { bright, exe, camelCase } = require("../lib/lib");
const { yellow, green, red, bold, purple } = require("../../lib/color");
const { header, warn } = require("../../lib/log");
const fs = require("fs");
const path = require("path");

const cliArgs = require("minimist")(process.argv.slice(3));

// TODO: below needs to be rewritten, done in rush

const availTests = () => {
  header("Tests available:");
  const tests = fs.readdirSync(`${__dirname}\\..\\tests`);
  tests.forEach(test => {
    const e = test.split(".");

    console.log(bold(e.shift()), ...e);
  });
  process.exit();
};

if (cliArgs._.length === 0) {
  console.error(`Enter test name.`);
  availTests();
}

const testName = `${cliArgs._[0]}.nexss-test.js`;

if (!fs.existsSync(`${__dirname}\\../tests/${testName}`)) {
  warn(`Test '${bold(testName)}' does not exist.`);
  availTests();
  process.exit();
}
const testsDef = require(`${__dirname}\\..\\tests\\${testName}`);
const startFrom = testsDef.startFrom;
const endsWith = testsDef.endsWith;
const omit = testsDef.omit;
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
console.log(`Test Folder Destination: ${testPath}`);
process.chdir(testPath);

var tests = 1;
var continuue = 0;
var totalPerformedTests = 0;
global.currentExtension = null;
testsDef.values.forEach(ext => {
  global.currentExtension = ext;

  console.log("===========================================================");
  console.log(yellow(`Testing \x1b[1m${bright(ext)}\x1b[0m`));

  if (continuue || ext === startFrom || !startFrom) {
    continuue = 1;

    if (omit.includes(ext)) {
      console.log(`\x1b[1m${bright(ext)} Ommitted\x1b[0m`);
      continuue = 1;
      return;
    }

    testsDef.tests.forEach(test => {
      console.log(yellow(test.title));

      test.tests.forEach(subtest => {
        console.log("===========================================");
        console.log(
          yellow(bright(`TEST ${tests++}`)),
          yellow(evalTS(subtest.title))
        );

        console.log(`===========================================`);
        eval(subtest.type || "shouldContain")(
          ...subtest.params.map(p => {
            if (p !== null && typeof p === "object") {
              return p;
            } else {
              return evalTS(p);
            }
          })
        );
        totalPerformedTests++;
      });
    });

    if (endsWith.includes(ext)) {
      console.log(yellow(`End`));
      process.exit(1);
      return;
    }
  }
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
  if (options && options.chdir) {
    console.log(`Changing Dir to: ${options.chdir}`);
    process.chdir(options.chdir);
  }

  if (test == "null") {
    //YES NULL as STRING
    if (!process.testData) {
      console.error("You need to specify REGEXP or STRING for the first test");
      process.exit();
    }
    console.log(`Using cached data result (REGEXP or STRING is empty)`);
    data = process.testData;
  } else {
    data = process.testData = exe(test);
  }

  // console.log("return: ", test, data);

  console.log(`${green(bright(test))} `);
  console.log(` ${camelCase(fname)}: ${bright(green(regE))}`);
  let regExp = new RegExp(regE, "i");
  let match = regExp.exec(data);
  let result = match && match.length > 1;
  let result2 = data && data.includes(regE);

  let title = "contains";
  if (fname === "shouldNotContain") {
    result = match && !result;
    result2 = !result2;
  }

  // console.log(result);
  // console.log(result2);
  if (result) {
    console.log(green(bright("PASSED")));
    // console.error(yellow(data));
    return match;
  } else if (result2) {
    console.log(green(bright("PASSED")));
    // console.error(yellow(data));
    return data;
  }
  console.error(
    red(bright(`=======================================================`))
  );

  console.error(red(bright(`But ${title}: `)));
  // Highlight the string which should not be there
  if (fname === "shouldNotContain") {
    data = data.replace(regE, bold(purple(regE)));
  }
  console.error(data);
  console.error(
    red(bright(`=======================================================`))
  );
  console.error("process.cwd()", process.cwd());
  process.exit(0);
}

function test2(ext) {
  const c = `nexss randomfile${ext}`;
  console.log(`Test2: ${c}`);
  return c;
}
