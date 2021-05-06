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
  ],
};
