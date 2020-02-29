module.exports = (data, field) => {
  if (!data[field]) {
    console.error(`Field '${field}' does not exist`);
  } else {
    console.log(data[field]);
  }

  process.exit(0);
};
