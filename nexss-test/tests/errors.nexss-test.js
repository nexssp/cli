const { join } = require("path");

let values = ["Nexss Errors"];

module.exports = {
  values,
  testsSelect: [1, 2],
  startFrom: "",
  endsWith: "",
  omit: [],
  tests: [
    {
      title: "Error",
      tests: [
        {
          title:
            "Check for data validation (_nexss.yml input: name: file, type: required)",
          params: ["nexss Nexss/Test/Errors", "file is required"],
        },
        {
          title: "Check for OK message",
          params: [
            "nexss Nexss/Test/Errors --file=any.jpg",
            "Error 1/2 from file 1: Standard STDERR",
          ],
        },
        {
          title: "Check for warning message",
          params: [null, "Warning from file (Between erros No 1/2 and 2/2)"],
        },
        {
          title: "Check for warning message",
          params: [null, "Error 2/2 from file 1: Standard STDERR"],
        },
        {
          title: "NexssStdin should not be there",
          type: "shouldNotContain",
          params: ["nexss Nexss/Test/Errors", "NexssStdin"],
        },
      ],
    },
    {
      title: "Errors Solutions",
      tests: [
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
            "Possible solution 1: Did you forget semi-color ';' ?",
          ],
        },
      ],
    },
    // {
    //   title: "nexss-command",
    //   onError: "stop", // global value
    //   tests: [
    //     {
    //       title: "Check not in the folder",
    //       type: "shouldContain",
    //       params: [
    //         "nexss cmd",
    //         "You are not in the Nexss Programmer project folder."
    //       ]
    //     }
    //   ]
    // }
  ],
};
