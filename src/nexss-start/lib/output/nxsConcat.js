const { CONCAT_RESULTS } = require("./nxsConstants");

module.exports = (data, concatFields) => {
  if (concatFields && concatFields.split) {
    data[CONCAT_RESULTS] = concatFields.split(",").map((element) => {
      if (!data[element]) {
        console.log(
          `output/nxsConcat.js: There is no ${element} field in the data.`
        );
        console.log(data);
        process.exit(0);
      }

      return data[element];
    });

    data[CONCAT_RESULTS] = data[CONCAT_RESULTS].flat();
    return data;
  }
};
