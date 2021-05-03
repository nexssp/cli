module.exports = {
  nexsstests: [
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
};
