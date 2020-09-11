let values = ["Nexss"];

module.exports = {
  values,
  startFrom: "",
  endsWith: "",
  omit: [],
  tests: [
    {
      title: "nexss-project",
      onError: "stop", // global value
      tests: [
        {
          title: "Create New Project",
          params: [
            "nexss project new MyTestProject -f",
            "SUCCESS  Project 'MyTestProject' is ready.",
          ],
        },
      ],
    },
    {
      title: "nexss arguments",
      onError: "stop",
      tests: [
        {
          title: "Check not in the folder",
          type: "shouldContain",
          params: [
            "nexss cmd",
            "You are not in the Nexss Programmer project folder.",
          ],
        },
      ],
    },
    {
      title: "nexss-command",
      onError: "stop", // global value
      tests: [
        {
          title: "Check not in the folder",
          type: "shouldContain",
          params: [
            "nexss cmd",
            "You are not in the Nexss Programmer project folder.",
          ],
        },
      ],
    },
  ],
};
