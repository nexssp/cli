module.exports = {
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
