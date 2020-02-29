module.exports = (data, fields) => {
  if (!fields.split) return data;
  values = fields.split(",").map(e => {
    return data[e];
  });
  return fields
    .split(",")
    .reduce((obj, key, index) => ({ ...obj, [key]: values[index] }), {});
};
