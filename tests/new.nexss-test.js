let values = ["Nexss"];

module.exports = {
  values,
  startFrom: "",
  endsWith: "",
  omit: [],
  tests: [
    {
      title: "Platform Specific Tests",
      onError: "stop",
      tests: [
        // {
        //   title: "",
        //   params: [
        //     "nexss Id --ABC='${fs.existsSync(\"KBDHAW.DLL\")}' --y='${nConst(\"xxx\",\"Works\")}' --final='${xxx}' --zzz='${(xxx = 555)}'",
        //     "cc",
        //   ],
        // },
        // {
        //   title: "App/Run",
        //   params: [
        //     "nexss App/Run --_app='ls -la'",
        //     "SUCCESS  Project 'MyTestProject' is ready.",
        //   ],
        // },
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
