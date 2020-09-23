const { join } = require("path");
const languages = require(join(
  process.env.NEXSS_SRC_PATH,
  "nexss-language",
  "repos.json"
));

let values = Object.keys(languages);

//values = [];
// values = values.slice(1, 30);

const {
  replaceCommandByDist,
  dist,
} = require(`${process.env.NEXSS_SRC_PATH}/lib/osys`);

const distName = dist();

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
          ".pd", // This language might be removed..
          // OTHER ISSUES
          // ".html",

          ".exs", // Something wrong during mix..
          ".ex", // Something wrong during mix..
          ".erl", // not finished..
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
          ".cpp", // Oracle Linux 8 does dont have rapid json in the main repo
          ".cc",
          ".groovy", // sdk PATH is not reloaded (the same as rust) - How to reload / from child_process of nodejs
          ".html", // is used only for templates
          ".swift",
          // NOT AVAILABLE ON LINUX/MAC

          // Other issues
          ".exs", // Something wrong during mix..
          ".ex", // Something wrong during mix..
          ".erl",
          ".jl", // issues with the permissions etc. look later
          ".cs", //Sometimes shows dotnet-script not found
          ".dart", //Some of the linux dist are not implemented
          ".hs", // TO implement
          ".java", // TO implement,
          ".kts", // TO IMPLEMENT default, helloWorld
          ".kt", // TO IMPLEMENT default, helloWorld
          ".scala", // TO implement
          ".hy", // TO implement
          ".coco", // TO IMPLEMENT default, helloWorld
          ".f90", // TO IMPLEMENT default, helloWorld
          ".d", // ACtivate function / make it automatic
          ".v", // TO implement
          ".bas", // TO implement
          ".zig", // TO implement
          ".m", // TO implement
          ".raku", // finish installer
          ".adb", // Ada: TO IMPLEMENT default, helloWorld (filename must be default not Default!)
          // =======================================================================================
          // ONLY WINDOWS BELOW - SO NOT IMPLEMENTED
          ".ahk",
          ".au3",
          ".vbs",
          ".wsf",
          ".pd",
          ".bat",
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
