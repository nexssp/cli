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
          title: "Error Test One",
          params: [
            "nexss Nexss/Test",
            "SUCCESS  Project 'MyTestProject' is ready."
          ]
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
