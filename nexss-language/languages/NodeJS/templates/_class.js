"use strict";
// npm i debug
const debug = require("debug")("className");

class ClassTemplate {
  constructor(param, opts) {
    fileExists(file);
    this.param = param;
    this.opts = opts || {};
  }

  someFunction() {
    var self = this;
    return new Promise(function(resolve, reject) {
      //something here
      // self as this.
      if (err) return reject(err);
      resolve(stats);
    });
  }
}

module.exports = function(opts) {
  return function(p) {
    return new ClassTemplate(p, opts);
  };
};
