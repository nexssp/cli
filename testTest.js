const { exec } = require("child_process");

// async function spawnChild() {
//   const { spawn } = require("child_process");
//   const child = spawn("nexss", ["test", "packages"]);

//   let data = "";
//   for await (const chunk of child.stdout) {
//     console.log("stdout chunk: " + chunk);
//     data += chunk;
//   }
//   let error = "";
//   for await (const chunk of child.stderr) {
//     console.error("stderr chunk: " + chunk);
//     error += chunk;
//   }
//   const exitCode = await new Promise((resolve, reject) => {
//     child.on("close", resolve);
//   });

//   if (exitCode) {
//     throw new Error(`subprocess error exit ${exitCode}, ${error}`);
//   }
//   return data;
// }

// function exe(command, options) {
//   options = options || {};
//   if (process.platform !== "win32") {
//     Object.assign(options, { shell: "/bin/bash" });
//   }

//   options.maxBuffer = 52428800; // 10*default
//   try {
//     const r = exec(`${command} --nxsPipeErrors`, options).toString();

//     r.stdout.on("data", console.log);

//     return r;
//   } catch (er) {
//     console.log("EEEEEEEEEEEEEEEERRRRRRRRRRROOOOOOOOOOORRRRRRRRRRR");
//     console.log(er);
//     // err.stderr;
//     // err.pid;
//     // err.signal;
//     // err.status;
//     // if (process.argv.includes("--errors")) {
//     //   console.error(er);
//     // }
//     // if (options && options.stopOnErrors) process.exitCode = 1;
//   }
// }

const { testNexss } = require("./nexss-test/commands/test");

// testNexss("packages");

// console.log(spawnChild());
