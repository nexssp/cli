/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports = {
  required: { message: '<Field> is required.', regexp: /\S/ },
  number: { message: '<Field> must be a number.', regexp: /^[0-9]*$/ },
  float: {
    message: '<Field> must be a FLOAT number.',
    regexp: /^[+-]?([0-9]*[.])?[0-9]+$/,
  },
  bool: {
    message: '<Field> must be true or false, 1 or 0',
    regexp: /^(true|false|1|0)$/,
  },
};
