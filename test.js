const { spawn } = require("child_process");

process.chdir("D:\\1\\!!!!!\\src");

const nexssStartArgs = [
  ".\\index.js"
  //   "--pipeerrors",
  //   "--quiet",

  //   "--cwd=D:\\1\\!!!!!\\src"
];
const spawnOptions = {
  detached: false,
  shell: true,
  stdio: ["inherit"]
};

var responder = spawn("nexss", nexssStartArgs, spawnOptions);
// res.writeHead(200, {
//   "Content-Type": "text/html; charset=utf-8"
// });
let data = "data:";
let err = "err:";
responder.stdout.on("data", d => {
  //   console.log(d);
  data += d;
});

responder.stderr.on("data", de => {
  console.log(err.toString());
  err += de;
});

responder.stdout.on("end", () => {
  console.log(data, "END DATA!!");
  console.log(err, "END ERROR!!");
});
