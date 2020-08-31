const { getFiles } = require("./start/files");
const minimist = require("minimist");
const { NEXSS_SPECIAL_CHAR } = require("../../config/defaults");

function stripEndQuotes(s) {
  if(process.platform==='win32'){
    return s.replace && s.replace(/(^["|'])|(["|']$)/g, "");
  }
  return s;
}

const nexssFileParser = (content, filename, nxsArgs) => {
  var { parseArgsStringToArgv } = require("string-argv");
  let lineNumber = 0;
  const nexssProgram = content.toString().trim().split(/\r?\n/);
  const totalLines = nexssProgram.length;

  const files = nexssProgram
    .map((line) => {
      line = line.trim(); // if there is unnecessary space at the end of line.
      lineNumber++;

      // Comments ommit
      if (line.startsWith("//") || line.length === 0) {
        return;
      }
      // remove inline comments
      if (!line.startsWith("https://")) {
        line = line.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, "");
        line = line.trim();
      }

      // console.log(line);
      // split by space but keep ""
      // let splitter = line.split(/\ (?=(?:(?:[^(("|')]*"){2})*[^("|')]*$)/);
      let splitter = parseArgsStringToArgv(line);
      // console.log(line, line.split(/\ (?=(?:(?:[^"]*"){2})*[^"]*$)/));
      const name = splitter.shift();
      // Add parameters added to the .nexss program to the last one.
      // if (totalLines === lineNumber && nxsArgs) {
      //   splitter = splitter.concat(nxsArgs);
      // }
      // console.log("splitter!!!", splitter);
      // Check if some arguments needs to be passed
      // Don't think combining  will all other args will be good in this
      // case.

      //

      let args = minimist(splitter);
      if (args._ && args._.length === 0) {
        delete args._;
      } else {
        args.nxsIn = args._;
        delete args._;
      }

      // We remove unnecessary quotes from the parameters of .nexss files.
      for (let [key, value] of Object.entries(args)) {
        if (!Array.isArray(value)) {
          if (isNaN(value)) {
            args[key] = stripEndQuotes(value);
          }
        } else {
          args[key] = args[key].map((a) => {
            return stripEndQuotes(a);
          });
        }
      }
      // delete args._;
      // if (nxsArgs) {
      //   // Object.assign(args, nxsArgs); // if actual parameters  pass to all lines
      //   args.nxsArgs = nxsArgs;

      // }

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

        if (
          f.name &&
          f.name !== NEXSS_SPECIAL_CHAR &&
          !f.name.startsWith("http")
        ) {
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
