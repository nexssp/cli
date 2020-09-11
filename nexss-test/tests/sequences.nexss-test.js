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
          title: "Default sequence",
          params: ["nexss Nexss/Test/Sequences", /"sequence":"default"/],
        },
        {
          title: "Named sequence",
          params: ["nexss Nexss/Test/Sequences --seq=one", /"sequence":"one"/],
        },
        {
          title: "Wrong sequence",
          params: [
            "nexss Nexss/Test/Sequences --seq=wrong",
            /sequence does not exist in the _nexss.yml/,
          ],
        },
        {
          // Parameters are passed
          title: "Capture Group",
          params: [
            "nexss Nexss/Test/Sequences --seq=aboutxasdasd",
            `"nxsParam_0": "aboutxasdasd",
  "nxsParam_1": "x",
  "nxsParam_2": "asdasd"`,
          ],
        },
        {
          title: "Naming Group",
          params: [
            "nexss Nexss/Test/Sequences --seq=2aboutxasdasd",
            `"found1":"x","found2":"a","found3":"sdasd"`,
          ],
        },
        {
          title: "Naming Group - with -seq",
          params: [
            "nexss Nexss/Test/Sequences --seq=3aboutxasdasd",
            `"found4":"x","found5":"a","found6":"sdasd"`,
          ],
        },
        {
          title: "Data in the sequences Overwrite",
          params: [
            "nexss Nexss/Test/Sequences --seq=mytestdata",
            `"myparam1": "overwritten"`,
          ],
        },
        // Below is not working on some of the Linux distributions
        // Check that later, commented as it's stops validation
        // TODO:
        // {
        //   title: "Sequence parameters with .nexss file",
        //   params: [
        //     process.platform === "win32"
        //       ? `nexss Nexss/Test/Sequences --seq="openFile/myvar"`
        //       : `nexss Nexss/Test/Sequences --seq='openFile/myvar'`,
        //     `"openFile":"myvar"`,
        //   ],
        // },
      ],
    },
  ],
};
