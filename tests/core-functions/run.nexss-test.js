module.exports = {
  defaultTestFunction: "nSpawn",
  nexsstests: [
    {
      params: [
        `nexss js run "console.log('xxxx')"`,
        /^xxxx/,
        { testFunction: "nSpawn" },
      ],
    },
  ],
};
