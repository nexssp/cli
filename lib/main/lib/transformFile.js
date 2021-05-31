/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports.transformFile = (file, x, y) => {
  const { Transform } = require('stream');
  const { createReadStream, existsSync } = require('fs');
  const { extname } = require('path');
  const { nxsDebugTitle } = require('./output/nxsDebug');
  // const { timeElapsed } = require("../../nexss-start/lib/output/nxsTime");
  return new Transform({
    objectMode: true,
    highWaterMark: require('../../config/defaults').highWaterMark,
    //  writableObjectMode: true,
    transform(chunk, encoding, callback) {
      if (chunk.stream === 'cancel') {
        log.dr(`))| CANCEL STREAM:NEXSS:transformFile`);
        callback(null, chunk);
        return;
      }
      log.di(`↳ Stream:transformFile`);

      process.chdir(y.cwd);
      process.nexssCWD = y.cwd;
      if (!existsSync(file)) {
        // Stop as first parameter is an error.
        callback(
          `File ${file} not found. Current dir (transformFile.js):${process.cwd()}`
        );
      }

      const startCompilerTime = process.hrtime();
      let { data } = chunk;
      nxsDebugTitle(`Transforming File: ${file}`, data, 'yellow');
      const streamRead = createReadStream(file);
      let wholeData = '';
      streamRead.on('data', (d) => {
        wholeData += d;
        // callback(null, data);
      });

      streamRead.on('error', (er) => {
        callback(er);
      });

      streamRead.on('end', () => {
        if (extname(file) === '.json') {
          try {
            const jsonToObj = JSON.parse(wholeData);
            data = { ...data, ...jsonToObj };
          } catch (e) {
            data.nxsStopReason = `Issue with json file: ${file}\n ERROR: ${e}`;
            data.nxsStop = true;
            data.status = 'error';
            data.stream = 'cancel';
            callback(data);
          }
        } else {
          data.nxsOut = wholeData;
        }
        // data = JSON.stringify(data);
        // timeElapsed(startCompilerTime, `Read file from ${bold(file)}`);
        callback(null, { from: 'transform-file', status: 'ok', data });
      });

      // streamRead.on("exit", (code, signal) => {
      //   // console.log(`finished worker!!!! code: ${code}, ${signal}`);
      //   // callback(null, null);
      //   self.end();
      //   callback();
      // });
    },
    flush(cb) {
      cb();
      // console.log("flush!!!!!");
    },
  });
};
