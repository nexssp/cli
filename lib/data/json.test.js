// stringify/parse with functions
// FIXME: This needs to be checked as function works, but not working on tests
var test = require("tape");

const json = require("./json");

test(`lib/data/json`, function(assert) {
  assert.plan(1);

  const jsonContent = {
    a: 1,
    f: function(x) {}
  };

  const jsonString = json.stringify(jsonContent);
  assert.equal(
    jsonContent,
    json.parse(jsonString),
    "stringify/parse with functions"
  );
  assert.end();
});
