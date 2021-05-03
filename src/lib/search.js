const fuzzy = require("fuzzy");
function searchData(data, arg, value) {
  if (!arg) arg = null;
  return (answers, input) => {
    input = input || "";
    return new Promise(function(resolve, reject) {
      try {
        var fuzzyResult = fuzzy.filter(input, data(value || answers[arg]));
        resolve(
          fuzzyResult.map(function(el) {
            return el.original;
          })
        );
      } catch (error) {}
    });
  };
}

module.exports.searchData = searchData;
