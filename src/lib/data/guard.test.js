/*
 * Title: Datatype Guard Tests - Nexss Framework
 * Description: Check datatypes Tests
 * Author: Marcin Polak
 * 2017/02/01 initial version
 * 2019/07/30 modify to handle everything in async/await
 * usage: npm install -g colortape && colortape *.test.js
 */

//https://ci.testling.com/guide/tape

const test = require("tape");
const { is, isEmpty, validDatatypes } = require("./guard");
const { inspect } = require("util");

(async () => {
  console.time("test");
  for (const dataType in validDatatypes) {
    test(`====> Start testing '${dataType}'.. <====`, async function(t) {
      const dataToCheck = validDatatypes[dataType]();
      const length = dataToCheck.length;
      if (length > 0) {
        t.test(`${length} tests for ${dataType}`, async function(assert) {
          assert.plan(dataToCheck.length);
          for (const data of dataToCheck) {
            assert.equal(
              await is(dataType, data),
              true,
              `${inspect(data, true, 0)} is ${dataType}`
            );
          }
          assert.end();
        });
      } else {
        t.comment(`No tests for ${dataType}`);
        t.end();
      }
    });
  }
  console.timeEnd("test");
})();
