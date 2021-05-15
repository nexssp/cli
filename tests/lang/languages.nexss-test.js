const { join } = require("path");

const languages = require(join(
  __dirname,
  "../../src/",
  "nexss-language",
  "repos.json"
));

let languageExtensions = Object.keys(languages);

module.exports = {
  uniqueTestValues: languageExtensions,
  testsSelect: [1, 2],
  startFrom: null, // eg. .cs
  endsWith: null, // eg .cs
  omit:
    process.platform === "win32"
      ? require("./languages-windows.config").windowsOmmit
      : require("./languages-linux.config").linuxOmmit,
  nexsstests: [
    {
      title: "Creating file for ${uniqueTestValue}",
      type: "shouldContain",
      params: [
        "nexss file add Default${uniqueTestValue} --t=default --f",
        /OK File (.*) has been created/,
      ],
    },
    {
      title: "Test without Unicode",
      type: "shouldContain",
      params: ["nexss Default${uniqueTestValue}", /"test":(.*)"test"/],
    },
    {
      title: "Test Unicode characters",
      type: "shouldContain",
      params: [
        "nexss Default${uniqueTestValue} --nxsTest",
        /"test":(.*)"test"/,
      ],
    },
  ],
};
