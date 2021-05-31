/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports = (data, field) => {
  if (!data[field]) {
    if (field !== 'nxsOut') {
      if (data[field] === 'true') {
        console.error(`Field '${field}' does not exist`);
      } else {
        field = 'nxsOut';
        if (Array.isArray(data[field])) {
          if (data[field].length === 1) {
            console.log(data[field][0]);
          } else {
            console.log(data[field]);
          }
        } else {
          if (data[field]) {
            // stdout is used for ! and !! special commands.
            console.log(data[field]);
          }

          if (data.stdout) {
            console.log(data.stdout);
          }
          if (data.stderr) {
            console.log('Error:');
            console.log(data.stderr);
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
