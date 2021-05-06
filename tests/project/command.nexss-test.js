const projectTests = require("./project.nexss-test");
const t = {
  defaultType: "shouldContain",
  nexsstests: [
    projectTests.nexsstests[0], //We create new project
    {
      title: "Check command add",
      params: [
        "nexss cmd add init " + (process.platform === "win32" ? "dir" : "ls"),
        `SUCCESS  Done..`,
        {
          // chdir: "MyTestProject",
          keepchdir: "MyTestProject", // will keep changing dir on the next tests.
        },
      ],
    },
    {
      title: "Check command run command",
      params: [
        "nexss cmd init",
        process.platform === "win32" ? "Volume in" : "_nexss.yml",
      ],
    },
    {
      title: "Check command is already in the project",
      params: ["nexss cmd add init nexss Id", `is already in the config file`],
    },
    {
      title: "List commands",
      params: ["nexss cmd", /init.*(dir|ls)/],
    },
  ],
};

module.exports = t;
