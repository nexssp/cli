module.exports = {
  defaultTestFunction: 'nSpawn',
  notEval: true,
  nexsstests: [
    {
      params: [
        `nexss js run "console.log("xxxx")"`,
        /^xxxx/,
        // { testFunction: "nSpawn" },
      ],
    },
  ],
};
