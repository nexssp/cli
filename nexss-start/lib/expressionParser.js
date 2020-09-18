const parserSyntax = require("./parserSyntax");
const { error } = require("../../lib/log");
const { red, bold, blue, yellow } = require("@nexssp/ansi");

const expressionParser2 = (data) => {
  if (!data) return data;
  let jsON = JSON.stringify(data);

  parserSyntax.forEach((ps) => {
    jsON = jsON.replace(ps.match, ps.replace);
  });

  let errors = new Set();
  let inter;
  try {
    inter = jsON.interpolate(data);
  } catch (er) {
    let maybe = [];
    if (er.message.includes("is not defined")) {
      const undefinedVar = er.message.split(" ")[0];

      Object.keys(data).forEach((k) => {
        if (undefinedVar.similarity(k) > 50) {
          maybe.push(k);
        }
      });
    }
    errors.add(
      `Some of your \$\{\} expression has an error.\nError message: ${bold(
        er.message
      )} ${maybe ? `\nDid you meant: ${bold(maybe.join(" or "))}?` : ""}`
    );
  }

  if (errors.size > 0) {
    errors.forEach((se) => {
      error(se);
    });
    process.exit(0);
  }

  return JSON.parse(inter.replace(/\\/g, "\\\\"));
};

const expressionParser = (data, exp) => {
  // console.log(data);

  // if (!exp) exp = data;
  // if (Object.prototype.toString.call(exp) === `[object Object]`) {
  //   return Object.assign(
  //     {},
  //     Object.keys(exp).map(ex => expressionParser(data, ex))
  //   );
  // }
  if (Array.isArray(exp)) {
    return exp.map((subexpr) => expressionParser(data, subexpr));
  }

  let errors = new Set();
  if (exp && isNaN(exp) && exp.includes && exp.includes("${")) {
    try {
      return exp.interpolate(data);
    } catch (er) {
      let maybe = [];
      if (er.message.includes("is not defined")) {
        const undefinedVar = er.message.split(" ")[0];

        Object.keys(data).forEach((k) => {
          if (undefinedVar.similarity(k) > 50) {
            maybe.push(k);
          }
        });
      }
      errors.add("=".repeat(80));
      errors.add(
        bold(`\tError in parsing expression: ${exp},`) +
          red(bold(`\n\tError message: ${yellow(bold(er.message))}`)) +
          ` ${
            maybe && maybe.length > 0
              ? blue(`\nDid you meant: ${maybe.join(" or ")}?`)
              : ""
          }`
      );

      errors.add(data);
    }
  }

  if (errors.size > 0) {
    errors.forEach((se) => {
      error(se);
    });
    process.exit(0);
  }

  return exp;
};

module.exports.expressionParser = expressionParser;
