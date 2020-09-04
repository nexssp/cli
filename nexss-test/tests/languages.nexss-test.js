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
  startFrom: ".bat", // eg. .cs
  endsWith: null, // eg .cs
  omit: [
    // ".html", // No json parsing
    ".tcl", // Wrong unicode characters
    ".pd", // To check
    // ".d", // dome compiler proble, default.d not found
    ".exs",
    ".ex",
    ".erl", // Compiler needs to be installed during adding a file (compile of lib is needed)
    ".hs", // Add json in/out templates
    ".f90", // Add json
    // ".kts", // add json + utf-8
    // ".vbs",
    // ".wsf",
    // ".nexss",
    // ".ex",
    // ".java",
    // ".scala", // unicode characters not working
    // // ".json", //implement to free version
    ".bat", //finish the json,
    // ".v",
    // ".clj",
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
            /OK  File (.*) has been created/,
          ],
        },
        {
          title: "Test without Unicode",
          type: "shouldContain",
          params: ["nexss Default${ext}", /"test":(.*)"test"/],
        },
        {
          title: "Test Unicode characters",
          type: "shouldContain",
          params: ["nexss Default${ext} --nxsTest", /"test":(.*)"test"/],
        },
      ],
    },
  ],
};
