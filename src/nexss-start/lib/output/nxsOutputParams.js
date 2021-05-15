/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports.params = [
  // Input
  // "--nxsGlobal",
  // "--nxsGlobalForce",
  // "--nxsLocal",
  // "--nxsLocalForce",
  // Output
  "--nxsConcat",
  "--nxsConcatAs",
  "--nxsGlue",
  "--nxsJoin",
  "--nxsDelete",
  "--nxsField",
  "--nxsFields",
  "--nxsRename",
  "--nxsTime",
  "--nxsSelect",
  "--nxsExecute",
  //   "nxsDebug",
];
require("../../../lib/objects");
module.exports.cleanup = (params) => {
  if (params.filter) {
    return params.filter((e) => {
      e = e.split("=")[0];
      return !module.exports.params.includes(`${e}`);
    });
  } else if (typeof params === "object") {
    const x = Object.assign(
      {},
      Object.filter(params, ([k, v]) => {
        k = k.split("=")[0];
        return !module.exports.params.includes(`--${k}`);
      })
    );

    if (!x) return [];
    return x;
  }

  return params;
};
