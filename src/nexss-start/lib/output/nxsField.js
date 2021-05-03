module.exports = (data, field) => {
  if (!data[field]) {
    if (field !== "nxsOut") {
      if (data[field] === "true") {
        console.error(`Field '${field}' does not exist`);
      } else {
        field = "nxsOut";
        if (Array.isArray(data[field])) {
          if (data[field].length === 1) {
            console.log(data[field][0]);
          } else {
            console.log(data[field]);
          }
        }
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
