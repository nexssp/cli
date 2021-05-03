module.exports = {
  nexsstests: [
    {
      title: "Check not in the Nexss Programmer Project",
      type: "shouldContain",
      params: [
        "nexss cmd",
        "You are not in the Nexss Programmer project folder.",
      ],
    },
  ],
};
