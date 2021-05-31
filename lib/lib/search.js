const fuzzy = require('fuzzy');

function searchData(data, arg, value) {
  if (!arg) arg = null;
  return (answers, input) => {
    input = input || '';
    return new Promise((resolve, reject) => {
      try {
        const fuzzyResult = fuzzy.filter(input, data(value || answers[arg]));
        resolve(fuzzyResult.map((el) => el.original));
      } catch (error) {}
    });
  };
}

module.exports.searchData = searchData;
