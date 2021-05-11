global.log = require("@nexssp/logdebug");
Object.assign(global, require("@nexssp/ansi"));

const { worker } = require("../../src/nexss-start/lib/worker");

let chunk; //data to passs

let options; //spawn
let startStreamTime = true; // eg process.hrtime()

let streamCache; //if you want to stream cache

let callback = (x) => {
  if (x) process.stdout.write(x);
}; // custom function for callback (eg inside another stream)

let cmd = "node"; // eg node
let filename = "workA.js"; //eg abc.js
let argsStrings = [filename];
worker({ cmd, filename, callback, argsStrings, startStreamTime });
