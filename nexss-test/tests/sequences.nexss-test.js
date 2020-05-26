let values = ["Nexss"];

module.exports = {
  values,
  startFrom: "",
  endsWith: "",
  omit: [],
  tests: [
    {
      title: "NEXSS_ environment variables",
      onError: "stop", // global value,
      notEval: true, // Means that parameters will not be evaluated (like below it ${..} will be passed)
      tests: [
        {
          title: "Default sequence",
          params: ["nexss Nexss/Test/Sequences", /"sequence":"default"/],
        },
        {
          title: "Named sequence",
          params: ["nexss Nexss/Test/Sequences --seq=one", /"sequence":"one"/],
        },
        {
          title: "Wrong sequence",
          params: [
            "nexss Nexss/Test/Sequences --seq=wrong",
            /sequence does not exist in the _nexss.yml/,
          ],
        },
      ],
    },
  ],
};
