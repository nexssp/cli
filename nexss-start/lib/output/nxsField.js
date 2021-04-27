module.exports = (data, field) => {
  if (!data[field]) {
    if (field !== "nxsOut") {
      if (data[field] === "true") {
        console.error(`Field '${field}' does not exist`);
      } else {
        field = "nxsOut";
        console.log(data[field]);
        process.exit(0);
      }
    } else {
      // Server Output cleanup
      delete data.htmlOutput;
      delete data.nxsField;
      delete data.nxsModule;
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
