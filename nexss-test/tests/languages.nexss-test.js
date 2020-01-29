const { join } = require("path");
const languages = require(join(
  process.env.NEXSS_SRC_PATH,
  "nexss-language",
  "repos.json"
));

let values = Object.keys(languages);

//values = [];
// values = values.slice(1, 30);

module.exports = {
  values,
  testsSelect: [1, 2],
  startFrom: "",
  endsWith: "",
  omit: [
    ".html", // No json parsing
    ".json", // To Add combine json
    ".tcl",
    ".pd",
    ".scala",
    ".hs",
    ".kts",
    ".vbs",
    ".wsf"
  ],
  tests: [
    {
      title: "Test Compilers",
      onError: "stop", // global value
      tests: [
        {
          title: "Creating file for ${ext}",
          type: "shouldContain",
          params: [
            "nexss file add Default${ext} --t=default --f",
            "OK  File (.*) has been created"
          ]
        },
        {
          title: "Test without Unicode",
          type: "shouldContain",
          params: ["nexss Default${ext}", `"test":(.*)"test"`]
        },
        {
          title: "Test Unicode characters",
          type: "shouldContain",
          params: ["nexss Default${ext} --test", `"test":(.*)"test"`]
        }
      ]
    }
  ]
};
