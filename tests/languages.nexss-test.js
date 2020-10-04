const { join } = require("path");
const os = require("@nexssp/os");
const languages = require(join(
  process.env.NEXSS_SRC_PATH,
  "nexss-language",
  "repos.json"
));

let values = Object.keys(languages);

//values = [];
// values = values.slice(1, 30);
let linuxOmmit = [
  ".html",
  ".ahk",
  ".au3",
  ".vbs",
  ".wsf",
  ".pd",
  ".bat", // Above are not on Linux
  // ====================
];
switch (os.name()) {
  case os.distros.UBUNTU:
    linuxOmmit.push(".ex"); // Output stops / NODEJS10
    linuxOmmit.push(".exs");
    linuxOmmit.push(".erl"); // Works but - testing shows failed.
    linuxOmmit.push(".hs"); // Works but - testing shows failed.
    linuxOmmit.push(".kts"); // REMOVED COMPLETELY
    break;
}
//     linuxOmmit.push(".cs");
//     linuxOmmit.push(".erl");
//     linuxOmmit.push(".hs");
//     linuxOmmit.push(".java"); // error: package org.json does not exist
//     linuxOmmit.push(".kts");
//     linuxOmmit.push(".kt");
//     linuxOmmit.push(".scala"); // make installer
//     linuxOmmit.push(".f90"); //  implement helloworld/defult templates.
//     // .r language - need to be start again for no errors - see
//     linuxOmmit.push(".groovy"); // /root/.sdkman/bin/sdkman-init.sh: No such file or directory
//     linuxOmmit.push(".swift"); // destination path 'yaourt' already exists
//     break;
//   case os.distros.AMAZON:
//     // issue with installing JSON:PP
//     linuxOmmit.push(".cpp");
//     linuxOmmit.push(".clj"); // installer not working lein not found
//     linuxOmmit.push(".cc");
//     linuxOmmit.push(".tcl"); // package require json - notfound /tclib???
//     linuxOmmit.push(".jl"); // make shows error about tar,bsd tar....
//     linuxOmmit.push(".ex"); //  Dependency specified in the wrong format: {:json, "~> 1.2"}
//     linuxOmmit.push(".exs"); //  Dependency specified in the wrong format: {:json, "~> 1.2"}
//     linuxOmmit.push(".erl"); //  escript: exception error: undefined function mochijson2:decode/1
//     linuxOmmit.push(".hs"); //  implement default/hellow worls stdin/out json
//     linuxOmmit.push(".java"); // error: package org.json does not exist
//     linuxOmmit.push(".kts");
//     linuxOmmit.push(".kt"); // to implement installers// to implement installers
//     linuxOmmit.push(".rkt"); // not seen,path??
//     linuxOmmit.push(".scala"); // make installer
//     break;
//   case os.distros.ALPINE:
//     // issue with installing JSON:PP
//     linuxOmmit.push(".clj"); // installer not working lein not found
//     linuxOmmit.push(".cpp"); // Error relocating /root/.nexssApps/vcpkg/downloads/tools/cmake-3.17.2-linux/cmake-3.17.2-Linux-x86_64/bin/cmake: gnu_dev_minor: symbol not found
//     linuxOmmit.push(".cc"); // installer not working lein not found
//     linuxOmmit.push(".jl"); // installer not working lein not found
//     linuxOmmit.push(".cs"); // dotnet not found
//     linuxOmmit.push(".java"); // error: package org.json does not exist
//     linuxOmmit.push(".ex"); //  Dependency specified in the wrong format: {:json, "~> 1.2"}
//     linuxOmmit.push(".exs"); //  Dependency specified in the wrong format: {:json, "~> 1.2"}
//     linuxOmmit.push(".erl"); //
//     linuxOmmit.push(".hs"); //
//     linuxOmmit.push(".kts");
//     linuxOmmit.push(".kt"); // to implement installers// to implement installers
//     linuxOmmit.push(".rkt"); // not seen,path??
//     linuxOmmit.push(".groovy"); // /root/.sdkman/bin/sdkman-init.sh: No such file or directory
//     linuxOmmit.push(".scala"); // make installer
//     linuxOmmit.push(".dart");
//     linuxOmmit.push(".f90"); //  implement helloworld/defult templates.
//     // linuxOmmit.push(".f90"); //  implement helloworld/defult templates.
//     break;
//   case os.distros.ARCH:
//     // issue with installing JSON:PP
//     linuxOmmit.push(".cs"); // installer not working lein not found // The framework 'Microsoft.NETCore.App', version '2.1.0' was not found
//     linuxOmmit.push(".ex"); // Could not find Hex, which is needed to build dependency :json
//     linuxOmmit.push(".exs"); // The same as above Could not find Hex, which is needed to build dependency :json
//     linuxOmmit.push(".erl"); //  exception error: undefined function mochijson2:decode/1
//     linuxOmmit.push(".go"); // Errors occurred, no packages were upgraded.
//     linuxOmmit.push(".hs"); // Implement HelloWorld/Default templates
//     linuxOmmit.push(".java"); // error: package org.json does not exist
//     linuxOmmit.push(".kts"); // OpenJDK 64-Bit Server VM warning: Options -Xverify:none and -noverify were deprecated in JDK 13 and will likely be removed in a future release
//     linuxOmmit.push(".kt");
//     linuxOmmit.push(".f90"); // Implement JSON - helloWorld/Default templates
//     linuxOmmit.push(".d"); // source ~/dlang/dmd-2.093.1/activate - make it automatic
//     linuxOmmit.push(".groovy"); // /root/.sdkman/bin/sdkman-init.sh: No such file or directory
//     linuxOmmit.push(".swift"); // destination path 'yaourt' already exists
//     linuxOmmit.push(".v"); // v command not found - installed but path issue
//     linuxOmmit.push(".clj"); // works but lein exec issue..
//     linuxOmmit.push(".coco"); // works but lein exec issue..
//   case os.distros.ORACLE:
//     linuxOmmit.push(".cpp"); // No CMAKE_CXX_COMPILER could be found
//     linuxOmmit.push(".cc"); // No CMAKE_CXX_COMPILER could be found
//     linuxOmmit.push(".lua"); // Re-check - should work
//     break;

//   default:
//     break;
// }

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
      : linuxOmmit,
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
