module.exports = {
  nexsstests: [
    // Validation - todo / Worked..
    // {
    //   title:
    //     "Check for data validation (_nexss.yml input: name: file, type: required)",
    //   params: ["nexss Nexss/Test/Errors", "file is required"],
    // },
    {
      title: "Check for file is required field.",
      params: ["nexss Nexss/Test/Errors", "'file' is required"],
    },
    {
      title:
        "Check for OK message (Please wait.. installing additional compilers)",
      params: [
        "nexss Nexss/Test/Errors --file=any.jpg",
        "Error 1/2 from file 1: Standard STDERR",
      ],
    },
    {
      title: "Check for warning message",
      params: [null, "Warning from file (Between errors No 1/2 and 2/2)"],
    },
    {
      title: "Check for warning message",
      params: [null, "Error 2/2 from file 1: Standard STDERR"],
    },
    {
      title: "NexssStdin should not be there",
      type: "shouldNotContain",
      params: ["nexss Nexss/Test/Errors", "NexssStdin"],
    },
  ],
};
