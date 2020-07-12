let values = ["Nexss"];

module.exports = {
  values,
  tests: [
    {
      title: "nxs Core Functions located nexss-start/writeableStdout.js",
      tests: [
        {
          title: "--nxsTime",
          params: ["nexss Id --nxsTime", /"nxsTime":\[\d+,\d+\]/],
        },
      ],
    },
  ],
};
