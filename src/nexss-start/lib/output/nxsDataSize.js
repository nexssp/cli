/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports.dataSize = (data) => {
  if (data) {
    let color = "\u001b[43;1m"; //grey
    console.error(
      `Data size: ${color} ${JSON.stringify(data).length} B OR ${(
        JSON.stringify(data).length / 1024
      ).toFixed(2)} KB\x1b[0m`
    );
  }
};
