module.exports = (data, fields) => {
  if (!Array.isArray(fields)) {
    if (!fields.split) return data;
    fields = fields.split(",");
  }

  fields.forEach(e => {
    delete data[e];
  });
  delete data["nxsDelete"];
  return data;
};
