// stdin module

const { readFileSync } = require("fs");

module.exports.win32 = () => {
  // if (process.platform !== "win32") {
  //   // Linux fix
  //   process.stdin.resume();
  // }
  var chunks = [];
  try {
    do {
      var chunk = readFileSync(0, "utf8");
      chunks.push(chunk);
    } while (chunk.length);
  } catch (error) {
    // console.error(`STDIN Error: ${error}`);
    // console.trace();
    if (process.platform !== "win32") {
      process.stdin.destroy();
    }
  }

  return chunks.join("");
};

module.exports.linux = () => {
  if (process.platform !== "win32") {
    if (process.stdin.isTTY) {
      return "";
    }
    // Linux fix
    process.stdin.resume();
  }
  var chunks = [];
  try {
    do {
      var chunk;
      if (process.platform !== "win32") {
        chunk = readFileSync("/dev/stdin").toString();
      } else {
        chunk = readFileSync(0, "utf8").toString();
      }
      chunks.push(chunk);
    } while (chunk.length);
  } catch (error) {
    // console.error(`STDIN Error: ${error}`);
    // console.trace();
    if (process.platform !== "win32") {
      process.stdin.destroy();
    }
  }

  return chunks.join("");
};
