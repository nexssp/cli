module.exports = {
  notEval: true, // params won't be evaluated before begin.
  nexsstests: [
    {
      title: 'NEXSS_APPS_PATH',
      params: [
        "nexss Id --testEnv='${process.env.NEXSS_APPS_PATH}'",
        /"testEnv":".*\.nexssApps/,
      ],
    },
    {
      title: 'NEXSS_LANGUAGES_PATH',
      params: [
        "nexss Id --testEnv='${process.env.NEXSS_LANGUAGES_PATH}'",
        /"testEnv":".*\.nexss.*languages/,
      ],
    },
    {
      title: 'NEXSS_HOME_PATH',
      params: [
        "nexss Id --testEnv='${process.env.NEXSS_HOME_PATH}'",
        /"testEnv":".*\.nexss.*"/,
      ],
    },
  ],
};
