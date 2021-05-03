module.exports = {
  nexsstests: [
    {
      title: "Check Capturing Group (*.?)",
      params: [
        "nexss Nexss/Test/ErrorsSolutions/src/errors1.js",
        "Define 'testNotExistVariable2' before you use it.",
      ],
    },
    {
      title: "Check Named Group (?<found1>.*?)",
      params: [
        `nexss Nexss/Test/ErrorsSolutions/src/errors2.js`,
        "Possible solution 1: Define 'DefineBeforeUseVar' before you use it",
      ],
    },
    {
      title: "Check String Solution",
      params: [
        `nexss Nexss/Test/ErrorsSolutions/src/errors3.js`,
        "Possible solution 1: Did you forget semi-colon ';' ?",
      ],
    },
  ],
};
