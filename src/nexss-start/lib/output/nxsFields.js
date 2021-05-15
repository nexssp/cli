/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports = (data, fields) => {
  if (!fields.split) return data;
  values = fields.split(",").map((e) => {
    return data[e];
  });
  return fields
    .split(",")
    .reduce((obj, key, index) => ({ ...obj, [key]: values[index] }), {});
};
