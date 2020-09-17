let values = ["Nexss"];

module.exports = {
  values,
  startFrom: "",
  endsWith: "",
  omit: [],
  tests: [
    {
      title: "NEXSS_ pipes",
      onError: "stop", // global value,
      notEval: true, // Means that parameters will not be evaluated (like below it ${..} will be passed)
      tests: [
        {
          title: "Simply Pipe",
          params: [
            "nexss Id --nxsAs=MY1 | nexss Id --nxsAs=MY2",
            /"MY1":".*".*"MY2":".*"/,
          ],
        },
        {
          title: "Long Pipe",
          params: [
            "nexss Id --nxsAs=MY1 | nexss Id --nxsAs=MY2 | nexss Id --nxsAs=MY3 | nexss Id --nxsAs=MY4 | nexss Id --nxsAs=MY5 | nexss Id --nxsAs=MY6",
            /"MY1":".*".*"MY2":".*".*"MY3":".*".*"MY4":".*".*"MY5":".*".*"MY6":".*"/,
          ],
        },
      ],
    },
  ],
};