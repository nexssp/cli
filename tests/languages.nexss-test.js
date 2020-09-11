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
  startFrom: ".hy", // eg. .cs
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
          ".ps1",
          // ".d", // dome compiler proble, default.d not found
          ".exs",
          ".ex",
          ".erl", // Compiler needs to be installed during adding a file (compile of lib is needed)
          ".hs", // TO IMPLEMENT default, helloWorld
          ".f90", // TO IMPLEMENT default, helloWorld
          ".v", // TO IMPLEMENT default, helloWorld
          ".coco", // TO IMPLEMENT default, helloWorld
          ".hy", // TO IMPLEMENT default, helloWorld
          ".bas", // TO IMPLEMENT default, helloWorld
          ".zig", // TO IMPLEMENT default, helloWorld
          ".m", // Octave: TO IMPLEMENT default, helloWorld
          ".adb", // Ada: TO IMPLEMENT default, helloWorld (filename must be default not Default!)
          ".kts", //Kotlin: // add json + utf-8
          ".kt", //Kotlin: // add json + utf-8
          ".scala", // unicode characters not working
          ".vbs", // TO IMPLEMENT default, helloWorld
          ".wsf", // TO IMPLEMENT default, helloWorld
          ".bat", //finish the json,
          ".html", // is used only for templates
        ]
      : [
          ".html", // is used only for templates
          // NOT AVAILABLE ON LINUX/MAC
          ".ahk",
          ".au3",
          ".vbs",
          ".wsf",
          ".pd",
          ".bat",
          // Other issues
          ".jl", // issues with the permissions etc. look later
          ".ps1", //Shows Error on nexss my.ps1 --nocache --nxsTest --x=123 ### ERROR on linux.
          ".cs", //Sometimes shows dotnet-script not found
          ".ex", // Better install
          ".exs",
          ".erl", // TO implement
          ".hs", // TO implement
          ".hx", // TO implement
          ".java", // TO implement,
          ".kts", // TO IMPLEMENT default, helloWorld
          ".kt", // TO IMPLEMENT default, helloWorld
          ".rb", // TO implement
          ".scala", // TO implement
          ".nim", // TO implement
          ".hy", // TO implement
          ".coco", // TO IMPLEMENT default, helloWorld
          ".coco", // TO IMPLEMENT default, helloWorld
          ".f90", // TO IMPLEMENT default, helloWorld
          ".d", // ACtivate function / make it automatic
          ".v", // TO implement
          ".bas", // TO implement
          ".zig", // TO implement
          ".m", // TO implement
          ".raku", // finish installer
          ".adb", // Ada: TO IMPLEMENT default, helloWorld (filename must be default not Default!)
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
