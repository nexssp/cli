const { error, warn } = require("../../lib/log");
const { bold, yellow, blue } = require("../../lib/color");
const { getLangByFilename } = require("../../nexss-language/lib/language");
const { normalize, isAbsolute, extname, dirname } = require("path");
const { existsSync } = require("fs");
const { colorizer } = require("./colorizer");

// more here: https://github.com/nexssp/cli/wiki/Errors-Solutions
module.exports.parseError = (filename, errorBody, stdOutput) => {
  if (errorBody && errorBody.trim) {
    errorBody = errorBody.trim();
  }
  const filenameStore = filename;
  const langInfo = getLangByFilename(filename);
  // exit codes, to display in bash last command $?
  // console.log(langInfo.compiler.split(" ")[0]);

  // We display error to standard output eg --server
  // console.log(errorBody);
  // if (
  //   !errorBody.includes(`${filename}.exe`) &&
  //   errorBody.includes(
  //     "is not recognized as an internal or external command"
  //   ) &&
  //   extname(filename) !== ".bat"
  // ) {
  //   warn(
  //     bold(
  //       yellow("RESTART YOUR TERMINAL:") +
  //         "You may need to restart your teminal in order to continue without issues."
  //     )
  //   );
  //   process.exit(1);
  // }

  const ErrorPre = isAbsolute(filename)
    ? filename
    : `${process.cwd()}/${filename}`;

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
    // This below is much better in Nexss Programmer PRO.
    // Here we need to distingquish unlimited nested programms
    // like nexss, in nexss, in nexss...
    if (
      errorBody.startsWith("OK ") ||
      errorBody.startsWith("INFO ") ||
      errorBody.startsWith("WARN ") ||
      errorBody.startsWith("SUCESS ") ||
      errorBody.startsWith("DEBUG ")
    ) {
      console.error(colorizer(errorBody));
    } else {
      error(`${ErrorPre}: ${bold(errorBody)}`);
    }
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
    Object.keys(langInfo.errors).forEach((pattern) => {
      let regExp;
      try {
        regExp = new RegExp(pattern, "gis");
      } catch (er) {
        //
        error("===========================================================");
        error(er.message);
        error(
          "Check error definition in the directory:",
          dirname(langInfo.configFile)
        );
        process.exit(0);
      }
      // let regExp = new RegExp(pattern, "gi");
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
      let replacer;
      if (langInfo.replacer) {
        // We load packages map (for example when something is not found, we replace with this map)
        // eg Data.aesis by aesis.
        if (existsSync(langInfo.replacer)) {
          replacer = require(langInfo.replacer);
        }
      }

      const ArrayMatch = Array.from(match);
      if (ArrayMatch && ArrayMatch[0] && ArrayMatch[0].groups) {
        if (solution && solution.replace) {
          if (ArrayMatch[0].groups) {
            Object.keys(ArrayMatch[0].groups).forEach((e) => {
              const reg = new RegExp(`<${e}>`, "gi");

              solution = solution.replace(reg, ArrayMatch[0].groups[e]);
            });
          }
        }
      } else if (ArrayMatch && ArrayMatch[0] && ArrayMatch[0].length > 1) {
        //console.log("find: ", pattern);
        //console.log(match);
        // We display errors to standard output (eg --server)

        // langInfo.packagesMap contains the mapping so we can display right
        // package name
        let am = ArrayMatch[0][1];
        if (solution.replace) {
          solution = solution
            .replace(/<package>/g, am)
            .replace(/<module>/g, am)
            .replace(/<found1>/g, am);
        }
      } else if (errorBody.includes(pattern)) {
        // We display errors to standard output (eg --server)
      } else {
        solution = null;
      }
      if (solution) {
        if (replacer) {
          Object.keys(replacer).forEach((rpl) => {
            if (solution.replace) {
              solution = solution.replace(new RegExp(rpl, "g"), replacer[rpl]);
            }
            // else {
            //   if (typeof solution === "function") {
            //     solution(errorBody, filename, ArrayMatch, langInfo);
            //   }
            // }
          });
        }
        if (typeof solution === "function") {
          solution(errorBody, filename, ArrayMatch, langInfo);
        }
      }
      if (
        solution &&
        solution.includes &&
        !solution.includes(`${filename}.exe`)
      ) {
        if (stdOutput) {
          if (process.argv.includes("--htmlOutput")) {
            console.log("<BR/>");
            console.log(
              `${
                '<span style="color:green"><BR /><b>Possible solution' +
                solutionNumber +
                "</B>"
              }: ${solution}</span>`
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
