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
          title: "NEXSS_APPS_PATH",
          params: [
            "nexss Id --testEnv='${process.env.NEXSS_APPS_PATH}'",
            /"testEnv":".*\.nexssApps/,
          ],
        },
        {
          title: "NEXSS_LANGUAGES_PATH",
          params: [
            "nexss Id --testEnv='${process.env.NEXSS_LANGUAGES_PATH}'",
            /"testEnv":".*\.nexss.*languages/,
          ],
        },
        {
          title: "NEXSS_HOME_PATH",
          params: [
            "nexss Id --testEnv='${process.env.NEXSS_HOME_PATH}'",
            /"testEnv":".*\.nexss.*"/,
          ],
        },
      ],
    },
    // {
    //   title: "nexss-command",
    //   onError: "stop", // global value
    //   tests: [
    //     {
    //       title: "Check not in the folder",
    //       type: "shouldContain",
    //       params: [
    //         "nexss cmd",
    //         "You are not in the Nexss Programmer project folder."
    //       ]
    //     }
    //   ]
    // }
  ],
};
