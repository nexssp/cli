const { CONCAT_RESULTS } = require("./nxsConstants");

module.exports = (data, concatFields) => {
  if (concatFields && concatFields.split) {
    data[CONCAT_RESULTS] = concatFields.split(",").map(element => {
      if (!data[element]) {
        console.error(`There is no ${element} field in the data.`);
      }

      return data[element];
    });

    data[CONCAT_RESULTS] = data[CONCAT_RESULTS].flat();
    return data;
  }
};
