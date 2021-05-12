module.exports = {
  nexsstests: [
    {
      title: "Help display",
      params: [
        "nexss help",
        /To display help add 'help': nexss command help OR nexss package help/,
      ],
    },
    {
      title: "Help display - with an aliast (src/aliases.js)",
      params: [
        "nexss h",
        /To display help add 'help': nexss command help OR nexss package help/,
      ],
    },
    {
      title: "Help per core package",
      params: [
        "nexss file add help",
        /Adds a new file to the project \(with template selection\)/,
      ],
    },
    {
      title: "Help per package",
      params: ["nexss Id help", /Generates unique id/],
    },
  ],
};
