const { error } = require("../../lib/log");
const { bold, yellow } = require("../../lib/color");
const { getLangByFilename } = require("../../nexss-language/lib/language");

// more here: https://github.com/nexssp/cli/wiki/Errors-Solutions
module.exports.parseError = (filename, errorBody, stdOutput) => {
  const filenameStore = filename;
  const langInfo = getLangByFilename(filename);
  // exit codes, to display in bash last command $?
  // console.log(langInfo.compiler.split(" ")[0]);

  // We display error to standard output eg --server
  if (stdOutput) {
    console.log(`Error:${bold(errorBody)}`);
  } else {
    error(`${bold(errorBody)}`);
  }

  // We check errors based on the pattern in the languages definition
  //console.log();
  // console.log("===========================================================");
  // process.exit(1);
  const nexssConfig = require("../../lib/config").loadConfigContent();
  langInfo.errors = Object.assign(
    {},
    langInfo.errors,
    nexssConfig && nexssConfig.errors
  );
  // console.log("errrrrrrrrorrrrrssss", langInfo.errors);
  // process.exit(1);
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
      if (ArrayMatch && ArrayMatch.length > 0) {
        if (ArrayMatch[0].groups) {
          Object.keys(ArrayMatch[0].groups).forEach(e => {
            solution = solution.replace(`<${e}>`, ArrayMatch[0].groups[e]);
          });
        }
      } else if (match && match.length > 1) {
        //console.log("find: ", pattern);
        //console.log(match);
        // We display errors to standard output (eg --server)
        solution = solution
          .replace(/<package>/g, match[1])
          .replace(/<module>/g, match[1])
          .replace(/<found1>/g, match[1]);
      } else if (errorBody.includes(pattern)) {
        // We display errors to standard output (eg --server)

        return;
      } else {
        solution = null;
      }
      if (solution) {
        if (stdOutput) {
          console.log(`Possible solution ${solutionNumber}: ${solution}`);
        } else {
          console.error(
            yellow(
              `Possible solution ${solutionNumber}: ${bold(yellow(solution))}`
            )
          );
        }
        solutionNumber++;
      }
    });
  }
};
