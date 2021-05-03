let windowsOmmit = [
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
];

module.exports = { windowsOmmit };
