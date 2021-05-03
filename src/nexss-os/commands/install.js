// const {spawn} = require("child_process")

// const worker = child_process.spawn(cmd, argsStrings, options);
//       this.worker.cmd = nexssCommand;
//       this.worker.on("error", (err) => {
//         // throw Error(err);
//         switch (err.code) {
//           case "ENOENT":
//             error(
//               `TRANSFORM_nexss:${
//                 err.path
//               } not found. Command: ${cmd} ${args.join(" ")}`
//             );
//             break;
//           default:
//             error(
//               `TRANSFORM_nexss:Failed to start subprocess. ${err}. Maybe shell specified is not ok? process.shell: ${process.shell}`
//             );
//         }
//       });

//       this.worker.stderr.on("data", function (err) {
//         const errorString = err.toString();
