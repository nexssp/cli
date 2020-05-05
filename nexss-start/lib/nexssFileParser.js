const { getFiles } = require("./start/files");
const minimist = require("minimist");
const nexssFileParser = (content, filename, nxsArgs) => {
  let lineNumber = 0;
  const nexssProgram = content.toString().trim().split(/\r?\n/);
  const totalLines = nexssProgram.length;

  const files = nexssProgram
    .map((line) => {
      line = line.trim(); // if there is unnecessary space at the end of line.
      lineNumber++;
      // Comments ommit
      if (line.startsWith("//")) {
        return;
      }

      let splitter = line.split(" ");
      const name = splitter.shift();

      // Add parameters added to the .nexss program to the last one.
      if (totalLines === lineNumber && nxsArgs) {
        splitter = splitter.concat(nxsArgs);
      }

      // Check if some arguments needs to be passed
      // Don't think combining  will all other args will be good in this
      // case.

      let args = minimist(splitter);
      if (nxsArgs) {
        args.nxsArgs = nxsArgs;
      }

      let pathFilename = require("path").dirname(filename);

      // console.log("==========================================================");
      // console.log("name:        ", name);
      // console.log("lineNumber:        ", lineNumber);
      // console.log("filename:        ", filename);
      // console.log("path:        ", pathFilename);
      // console.log("args:        ", args);
      if (name) {
        let f = getFiles(
          {
            name,
            lineNumber,
            filename,
            path: pathFilename,
          },
          args
        );

        // When run - .nexss first is look at local folder then remote (eg. packages)

        if (f.path) {
          let toCheck = require("path").join(f.path, f.name);
          if (!require("fs").existsSync(toCheck)) {
            f.path = pathFilename;
            toCheck = require("path").join(f.path, f.name);
            if (!require("fs").existsSync(toCheck)) {
              console.error(
                "File does not exist in local and remote folders (where file is located).",
                toCheck
              );
            }
          }
        }

        // console.log("Result:", f);
        // console.log(
        //   "=========================================================="
        // );
        return f;
      } else {
        // console.log(
        //   "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!NO RESULT."
        // );
      }
    })

    .flat();

  return files;
};

module.exports = nexssFileParser;
