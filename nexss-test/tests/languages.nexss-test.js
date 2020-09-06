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
  startFrom: null, // eg. .cs
  endsWith: null, // eg .cs
  omit:
    process.platform === "win32"
      ? [
          // NOT IMPLEMENTED
          ".swift", // is not implemented on windows yet
          // OTHER ISSUES
          // ".html",
          ".tcl", // Wrong unicode characters
          ".pd", // To check
          // ".d", // dome compiler proble, default.d not found
          ".exs",
          ".ex",
          ".erl", // Compiler needs to be installed during adding a file (compile of lib is needed)
          ".hs", // TO IMPLEMENT defalt, helloWorld
          ".f90", // TO IMPLEMENT defalt, helloWorld
          ".v", // TO IMPLEMENT defalt, helloWorld
          ".coco", // TO IMPLEMENT defalt, helloWorld
          ".hy", // TO IMPLEMENT defalt, helloWorld
          ".bas", // TO IMPLEMENT defalt, helloWorld
          ".zig", // TO IMPLEMENT defalt, helloWorld
          ".m", // Octave: TO IMPLEMENT defalt, helloWorld
          ".adb", // Ada: TO IMPLEMENT defalt, helloWorld (filename must be default not Default!)
          ".kts", //Kotlin: // add json + utf-8
          ".kt", //Kotlin: // add json + utf-8
          ".scala", // unicode characters not working
          ".vbs", // TO IMPLEMENT defalt, helloWorld
          ".wsf", // TO IMPLEMENT defalt, helloWorld
          ".bat", //finish the json,
          ".html", // is used only for templates
        ]
      : [
          // NOT IMPLEMENTED ON LINUX/MAC
          ".ahk",
          ".au3",
          ".vbs",
          ".wsf",
          ".pd",
          ".jl", // issues with the permissions etc. look later
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
