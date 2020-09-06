module.exports = (data, field) => {
  if (!data[field]) {
    if (field !== "nxsOut") {
      console.error(`Field '${field}' does not exist`);
    } else {
      // Server Output cleanup
      delete data.htmlOutput;
      delete data.nxsField;
      delete data.nexssScript;
      delete data.nxsPipeErrors;
      delete data.quiet;
      console.log(data);
    }
  } else {
    console.log(data[field]);
  }

  process.exit(0);
};
