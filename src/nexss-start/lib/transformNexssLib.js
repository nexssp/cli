/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

const pushData = (data, chunk) => {
  let jsonData = false;

  if (!data.includes) {
    console.log(data);
  }

  if (data.includes("{") && data.includes("}")) {
    try {
      data = JSON.parse(data);
      if (data.nxsIn === "") {
        // Autohotkey - issue with delete object key - how to?
        delete data.nxsIn;
      }

      if (data.resultField_1 === "") {
        // Autohotkey - issue with delete object key - how to?
        delete data.resultField_1;
        delete data.nxsAs;
      }

      if (data.nxsAs === "") {
        // Autohotkey - issue with delete object key - how to?
        delete data.nxsAs;
      }

      if (!data.nxsStop) {
        return {
          // display: chunk.display,
          command: chunk.nexssCommand,
          from: "transform-nexss",
          status: "ok",
          data,
        };
      } else {
        const reason = data.nxsStopReason;
        delete data.nxsStop;
        delete data.nxsStopReason;
        return {
          // display: chunk.display,
          command: chunk.nexssCommand,
          from: "transform-nexss",
          stream: "stop",
          reason: reason ? reason : "reason not specified",
          status: "end",
          data,
        };
      }

      jsonData = ok;
    } catch (e) {
      // if ((data && data.startsWith("{")) || ifLonger) {
      //   // it can be json but not completed
      //   ifLonger += data;
      // }
    }
  }

  if (!jsonData) {
    return {
      // display: chunk.display,
      command: chunk.nexssCommand,
      from: "transform-nexss",
      stream: "ok",
      error: "not a json",
      data,
    };
  }
};

module.exports = { pushData };
