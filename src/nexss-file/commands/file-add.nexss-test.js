module.exports = {
  defaultTestFunction: "nSpawn",
  nexsstests: [
    {
      params: ["nexss js e", /File empty.js has been created./],
    },
    {
      params: ["nexss js d", /File default.js has been created./],
    },
    {
      params: ["nexss js h", /File helloWorld.js has been created./],
    },
    {
      params: ["nexss f a my1.js --default", /File my1.js has been created./],
    },
    {
      params: ["nexss f a my2.js --empty", /File my2.js has been created./],
    },
    {
      params: [
        "nexss f a my3.js --helloWorld",
        /File my3.js has been created./,
      ],
    },
  ],
};
