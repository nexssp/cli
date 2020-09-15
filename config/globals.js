Object.assign(global, require("../lib/ansi"));
const functions = {
  fs: require("fs"),
};

Object.assign(global, functions);
