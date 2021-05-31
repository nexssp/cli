/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports = (data, fields) => {
  if (!Array.isArray(fields)) {
    if (!fields.split) return data;
    fields = fields.split(',');
  }

  fields.forEach((e) => {
    delete data[e];
  });
  delete data.nxsDelete;
  return data;
};
