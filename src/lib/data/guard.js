/*
 * Title: Datatype Guard - Nexss Framework
 * Description: Check datatypes
 * Author: Marcin Polak
 * 2017/02/01 initial version
 * 2019/07/30 modify to handle everything in async/await
 */

// class ValidatorClass { // example: Object.prototype.toString.call(new ValidatorClass()); // "[object Validator]"
//   get [Symbol.toStringTag]() {
//     return 'Validator';
//   }
// }

const stream = require("stream");
const { stat } = require("fs");

const validDatatypes = {
  Object: () => [{}, { x: 1 }, { x: 1, y: { nested: true } }],
  String: () => ["", "mystring"],
  Array: () => [[0], [1, 2]],
  Number: () => [1, 1234, 36936936936936936936936936936936936936936936936936],
  Boolean: () => [true, false],
  Undefined: () => [undefined],
  Function: () => [() => {}, function() {}, () => "somestring"],
  Null: () => [null],
  Map: () => [new Map(), new Map([["key1", "value1"], ["key2", "value2"]])],
  Set: () => [new Set(), new Set([["key1", "value1"], ["key2", "value2"]])],
  GeneratorFunction: () => [function* x() {}],
  Promise: () => [Promise.resolve() /*, Promise.reject()*/],
  Stream: () => [
    new stream.Readable(),
    new stream.Writable(),
    new stream.Transform(),
    new stream.Stream(),
    new stream.Duplex(),
    new stream.PassThrough()
  ],
  File: () => [`${__dirname}/guard.js`, `${__dirname}/guard.test.js`],
  Directory: () => [`${__dirname}/../datatype`],
  Exists: () => [`${__dirname}/guard.js`, `${__dirname}/../datatype`]
  // async *[Symbol.asyncIterator]() {}
};

const is = async (what = "Object", v) => {
  if (!validDatatypes[what]) {
    throw new Error(`Guard module not allow for ${what} datatype.`);
  }
  if (
    what !== "Stream" &&
    what !== "File" &&
    what !== "Directory" &&
    what !== "Exists"
  ) {
    return Object.prototype.toString.call(v) === `[object ${what}]`;
  }
  const { promisify } = require("util");
  const { lstat, exists } = require("fs");

  if (what === "Stream") {
    return v !== null && typeof v === "object" && typeof v.pipe === "function";
  }

  if (!(await promisify(exists)(v))) {
    // console.warn(`File/Directory ${v} not found.`);
    return false;
  }

  if (what == "Exists") {
    return true;
  }

  const stat = await promisify(lstat)(v);
  if (what === "File") {
    return stat.isFile(v);
  }

  return stat.isDirectory(v);
};

const getFileUpdatedDate = async path => {
  const stats = fs.stat(path);
  return stats.mtime;
};

const isOlder = async (file1, file2) => {
  const mtimeFile1 = getFileUpdatedDate(file1);
  const mtimeFile2 = getFileUpdatedDate(file2);
  return (await mtimeFile1) < (await mtimeFile2);
};

const Exists = async fileOrDir => {
  return is("Exists", fileOrDir);
};

const isEmpty = async (what, v) => {
  switch (what) {
    case "Object":
      return Object.keys(v).length === 0;
    case "Array":
      return v.length === 0;
    default:
      break;
  }
};

module.exports = { is, Exists, isEmpty, isOlder, validDatatypes };
