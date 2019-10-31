const { error } = require("../../lib/log");
const { bold, blue, yellow } = require("../../lib/color");
const { getLangByFilename } = require("../../nexss-language/lib/language");

module.exports.parseError = (filename, errorBody) => {
  const filenameStore = filename;
  //console.log("===========================================");
  // console.log("errrrr:", errorBody);

  const langInfo = getLangByFilename(filename);
  // exit codes, to display in bash last command $?
  // console.log(langInfo.compiler.split(" ")[0]);
  error(`${bold(errorBody)}`);

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
  if (langInfo.errors) {
    Object.keys(langInfo.errors).forEach(pattern => {
      let regExp = new RegExp(pattern, "i");
      let match = regExp.exec(errorBody);
      let solution;

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
      if (match && match.length > 1) {
        //console.log("find: ", pattern);
        //console.log(match);
        error(
          `Possible solution:\n ${bold(yellow(solution))
            .replace(/<package>/g, match[1])
            .replace(/<module>/g, match[1])
            .replace(/<found1>/g, match[1])}`
        );
      } else if (errorBody.includes(pattern)) {
        console.error(blue(`Possible solution: ${bold(yellow(solution))}`));
      }
    });
  }

  //process.exit(1);
};
