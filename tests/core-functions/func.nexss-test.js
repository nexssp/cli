module.exports = {
  notEval: true, // params won't be evaluated before begin.
  nexsstests: [
    {
      params: ["nexss -version", /(\d).(\d).(\d)/],
    },
    {
      params: ["nexss -help", /List of quick\/helper/],
    },
    {
      params: ["nexss -env", /(Environment Variables|Tags:\/)/],
    },
    {
      params: ["nexss -dev-colors", `bold  grey  greyBG`],
    },
    {
      params: ["nexss -dev-validation", `required:`],
    },
    {
      params: ["nexss -global-config", `Global config path:`],
    },
    {
      params: [
        "nexss -dev-help",
        `Constants:
nConst`,
      ],
    },
    {
      title: "nexss -arg-progress = error no value",
      params: [
        "nexss -arg-progress",
        "You can only use: enable, 1, disable, 0. Your value: undefined",
        {
          exitCode: 1,
        },
      ],
    },
    {
      title: "nexss -output-colors = error no value",
      params: [
        "nexss -output-colors",
        "You can only use: enable, 1, disable, 0",
        {
          exitCode: 1,
        },
      ],
    },
    {
      title: "nexss -arg-progress ok",
      params: ["nexss -arg-progress 1", "arg:progress 1"],
    },
    {
      title: "nexss -output-colors ok",
      params: ["nexss -output-colors 1", "output:colors 1"],
    },
  ],
};
