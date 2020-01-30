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
          title: "Check for OK message",
          params: [
            "nexss Nexss/Test/Errors",
            "Error 1/2 from file 1: Standard STDERR"
          ]
        },
        {
          title: "Check for warning message",
          params: [null, "Warning from file (Between erros No 1/2 and 2/2)"]
        },
        {
          title: "Check for warning message",
          params: [null, "Error 2/2 from file 1: Standard STDERR"]
        },
        {
          title: "NexssStdin should not be there",
          type: "shouldNotContain",
          params: ["nexss Nexss/Test/Errors", "NexssStdin"]
        }
      ]
    }
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
  ]
};
