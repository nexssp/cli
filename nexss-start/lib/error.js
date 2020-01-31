const { error } = require("../../lib/log");
const { bold, yellow, blue } = require("../../lib/color");
const { getLangByFilename } = require("../../nexss-language/lib/language");
const { normalize, isAbsolute } = require("path");

// more here: https://github.com/nexssp/cli/wiki/Errors-Solutions
module.exports.parseError = (filename, errorBody, stdOutput) => {
  const filenameStore = filename;
  const langInfo = getLangByFilename(filename);
  // exit codes, to display in bash last command $?
  // console.log(langInfo.compiler.split(" ")[0]);

  // We display error to standard output eg --server

  const ErrorPre = isAbsolute(filename)
    ? filename
    : `${process.nexssCWD}\\${filename}`;

  if (stdOutput) {
    if (process.argv.includes("--htmlOutput")) {
      console.log(
        `<span style="color:red;">${ErrorPre} ${errorBody.replace(
          /\n/g,
          "<BR />"
        )}</span>`
      );
    } else {
      if (process.argv.includes("--pipeerrors")) {
        console.log(`ERROR ${ErrorPre}:${bold(errorBody)}`);
      } else {
        console.error(`ERROR ${ErrorPre}:${bold(errorBody)}`);
      }
    }
  } else {
    error(`${ErrorPre}: ${bold(errorBody)}`);
  }

  // We check errors based on the pattern in the languages definition
  const nexssConfig = require("../../lib/config").loadConfigContent();
  langInfo.errors = Object.assign(
    {},
    langInfo.errors,
    nexssConfig && nexssConfig.errors
  );

  let solutionNumber = 1;
  if (langInfo.errors) {
    Object.keys(langInfo.errors).forEach(pattern => {
      let regExp = new RegExp(pattern, "gi");
      let match = errorBody.matchAll(regExp);

      var solution;
      if (
        !Array.isArray(langInfo.errors[pattern]) &&
        typeof langInfo.errors[pattern] !== "object"
      ) {
        solution = langInfo.errors[pattern];
      } else {
        solution = langInfo.errors[pattern][process.platform];
        if (!solution) {
          solution = langInfo.errors[pattern]["all"];
        }
      }

      //Capturing naming groups
      // https://javascript.info/regexp-groups#named-groups
      const ArrayMatch = Array.from(match);
      if (ArrayMatch && ArrayMatch.groups) {
        if (ArrayMatch[0].groups) {
          Object.keys(ArrayMatch[0].groups).forEach(e => {
            const reg = new RegExp(`<${e}>`, "gi");

            solution = solution.replace(reg, ArrayMatch[0].groups[e]);
          });
        }
      } else if (ArrayMatch && ArrayMatch[0] && ArrayMatch[0].length > 1) {
        //console.log("find: ", pattern);
        //console.log(match);
        // We display errors to standard output (eg --server)
        solution = solution
          .replace(/<package>/g, ArrayMatch[0][1])
          .replace(/<module>/g, ArrayMatch[0][1])
          .replace(/<found1>/g, ArrayMatch[0][1]);
      } else if (errorBody.includes(pattern)) {
        // We display errors to standard output (eg --server)
      } else {
        solution = null;
      }

      if (solution) {
        if (stdOutput) {
          if (process.argv.includes("--htmlOutput")) {
            console.log("<BR/>");
            console.log(
              `${'<span style="color:green"><BR /><b>Possible solution' +
                solutionNumber +
                "</B>"}: ${solution}</span>`
            );
          } else {
            if (process.argv.includes("--pipeerrors")) {
              console.log(`Possible solution ${solutionNumber}: ${solution}`);
            } else {
              console.error(`Possible solution ${solutionNumber}: ${solution}`);
            }
          }
        } else {
          if (process.argv.includes("--pipeerrors")) {
            console.log(
              yellow(
                `Possible solution ${solutionNumber}: ${bold(yellow(solution))}`
              )
            );
          } else {
            error(
              yellow(
                `Possible solution ${solutionNumber}: ${bold(yellow(solution))}`
              )
            );
          }
        }
        solutionNumber++;
      }
    });
  }
};
