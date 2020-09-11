let values = ["Nexss"];

module.exports = {
  values,
  startFrom: "",
  endsWith: "",
  omit: [],
  tests: [
    {
      title: "NEXSS_ multiple projects",
      notEval: true, // Means that parameters will not be evaluated (like below it ${..} will be passed)
      tests: [
        {
          title: "MultipleProjects",
          params: [
            "nexss Nexss/Test/MultipleProjects",
            /"Hello1":"Hello 1 Test MultipleProjects","test":"test2","Hello2":"Hello 2 Test MultipleProjects"/,
          ],
        },
        {
          title: "MultipleProjects - long path to nexss file",
          params: [
            "nexss Nexss/Test/MultipleProjects/src/test.nexss",
            /"Hello1":"Hello 1 Test MultipleProjects","test":"test2","Hello2":"Hello 2 Test MultipleProjects"/,
          ],
        },
      ],
    },
  ],
};
