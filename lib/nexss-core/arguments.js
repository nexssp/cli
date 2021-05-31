// Constants for nexss programmer arguments
// they are available in the code like: nexss["output:colors"]
// they are only Nexss Programmer specific so you can only use them
// during one Nexss Programmer run and will be deleted after.

// Element can be [arg, description] or arg

const arguments = {
  "process:title": "Change process title, (also display on terminal window)",
  "output:keys": "Displays only keys (available variables) without data",
  "output:colors":
    "Colorize output. Also you can use nexss -colors 1 to enable it permanently.", //
  "output:pretty": "Displays nice looking JSON data", // Pretty JSON output,
  "error:pipe": "Displays nice looking JSON data", // Pretty JSON output
  "arg:progress": "Showing progress during installations.",
  "platform:check":
    "Program checks if platform match and platform:noerror is not set will return exitCode: 1. If platfrom:noerror is set then it will return exitCode: 0, but program will not run",
  "platform:noerror":
    "When platform does not match, command will not run, however it will return exitCode:0, so it can continue.",
  ":i":
    "When you run a program, from version 2.4.4, you need to pass n:i to start programes associated with JSON stdin so helloWorld, default etc.",
  "stream:cache":
    "Enables cache for streams, so each stream is freed(send to another one after finish.)",
};

// Proxy is used to not duplicate data or making constants etc. We use Object but when key does not exist
// We are notified with an error and line where is the issue with the key.
const proxyHandler = {
  get(target, name, receiver) {
    if (!target[name]) {
      process.stack(
        red(
          `Argument key ${name} does not exist. Check: 'src/nexss-core/arguments.js'`
        ),
        2
      );
      process.exit(1);
    }

    return name;
  },
};

const keys = new Proxy(arguments, proxyHandler);

module.exports = { arguments, keys };
