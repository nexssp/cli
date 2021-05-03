module.exports = {
  required: { message: "<Field> is required.", regexp: /\S/ },
  number: { message: "<Field> must be a number.", regexp: /^[0-9]*$/ },
  float: {
    message: "<Field> must be a FLOAT number.",
    regexp: /^[+-]?([0-9]*[.])?[0-9]+$/,
  },
  bool: {
    message: "<Field> must be true or false, 1 or 0",
    regexp: /^(true|false|1|0)$/,
  },
};
