/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

const { getFiles } = require("./start/files");
const minimist = require("minimist");
require("@nexssp/extend")("string");

function preVars(isn) {
  const { vars } = require("../../config/preVars");
  Object.keys(vars).forEach((e) => {
    isn = isn.replace(new RegExp(e, "g"), vars[e]);
  });

  return isn;
}

const nexssFileParser = (content, filename, nxsArgs) => {
  const path = require("path");
  if (!path.isAbsolute(filename)) {
    filename = path.resolve(filename);
  }

  var { parseArgsStringToArgv } = require("string-argv");
  let lineNumber = 0;
  const nexssProgram = preVars(content.toString()).trim().split(/\r?\n/);
  const totalLines = nexssProgram.length;

  const files = nexssProgram
    .map((line) => {
      const orgLine = line;
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
            args[key] = value.stripEndQuotes();
          }
        } else {
          args[key] = args[key].map((a) => {
            return a.stripEndQuotes();
          });
        }
      }

      const lineNxsPlatform = args.nxsPlatform;
      const { checkPlatform } = require("../../lib/platform");
      if (!checkPlatform(lineNxsPlatform)) {
        log.di(
          `line ommited (platform not match): \n${bold(yellow("LINE"))}: `,
          orgLine
        );
        return;
      }

      // delete args._;
      // if (nxsArgs) {
      //   // Object.assign(args, nxsArgs); // if actual parameters  pass to all lines
      //   args.nxsArgs = nxsArgs;

      // }

      let pathFilename = require("path").dirname(filename);
      process.NexssFilePath = pathFilename;

      // console.log("==========================================================");
      // console.log("name:        ", name);
      // console.log("lineNumber:        ", lineNumber);
      // console.log("filename:        ", filename);
      // console.log("path:        ", pathFilename);
      // console.log("args:        ", args);

      // Install package if not exists..
      if (name) {
        const pname = name.split("/")[0];
        // If this is package and is not installed install
        if (require("../../nexss-package/repos.json")[pname]) {
          if (
            !require("fs").existsSync(
              `${process.env.NEXSS_PACKAGES_PATH}/${pname}`
            )
          ) {
            console.log(`Installing package ${bold(pname)}..`);

            const {
              installPackages,
            } = require("../../nexss-package/lib/install");
            installPackages(process.env.NEXSS_PACKAGES_PATH, pname);
          } else {
            // console.log(`Package ${name} is there`);
          }
        } else {
          // console.log(`${pname} does not exist  `);
        }
        //=========================================================

        if (["^", "^^"].includes(startWithSpecialChar(name))) {
          // if command contains -- it will use as nexss programmer parameters eg. nxsAs= etc.
          let indexOfDashDash = splitter.indexOf("--");
          if (indexOfDashDash >= 1) {
            args = splitter.slice(indexOfDashDash + 1);
            splitter = splitter.slice(0, indexOfDashDash);
          }

          return {
            name,
            specialArgs: splitter, // This is just command which takes parameters as a raw line.
            lineNumber,
            path: pathFilename,
            filename,
            args,
          };
        } else {
          let params = {
            name,
            lineNumber,
            filename,
            path: pathFilename,
          };

          if (nxsArgs.seq) {
            params.seq = nxsArgs.seq;
          }

          let f = getFiles(params, args);

          // console.log(f);
          // process.exit(1);

          // When run - .nexss first is look at local folder then remote (eg. packages)

          if (
            f.name &&
            !startWithSpecialChar(f.name) &&
            !f.name.startsWith("http")
          ) {
            let toCheck = require("path").join(f.path, f.name);
            if (!require("fs").existsSync(toCheck)) {
              f.path = pathFilename;
              toCheck = require("path").join(f.path, f.name);
              const repos = require("../../nexss-package/repos.json");
              if (
                !require("fs").existsSync(toCheck) &&
                !repos[f.name.split("/")[0]]
              ) {
                log.error(
                  bold("\nFile does not exist in local and remote folders:\n"),
                  bold(yellow(toCheck))
                );
              }
            }
          }

          // console.log("Result:", f);
          // console.log(
          //   "=========================================================="
          // );
          // console.log(f);
          return f;
        }
      } else {
        // console.log(
        //   "NO RESULT."
        // );
      }
    })
    .flat();

  return files;
};

module.exports = nexssFileParser;
