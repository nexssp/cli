module.exports = {
  nexsstests: [
    {
      title: 'Default sequence',
      params: ['nexss Nexss/Test/Sequences', /"sequence":"default"/, ,],
    },
    {
      title: 'Named sequence',
      params: ['nexss Nexss/Test/Sequences --seq=one', /"sequence":"one"/],
    },
    {
      title: 'Wrong sequence',
      params: [
        'nexss Nexss/Test/Sequences --seq=wrong',
        /sequence does not exist in the _nexss.yml/,
        {
          exitCode: 1,
        },
      ],
    },
    // Disabled for more testing..
    //   {
    //     // Parameters are passed
    //     title: 'Capture Group',
    //     params: [
    //       'nexss Nexss/Test/Sequences --seq=aboutxasdasd',
    //       `"nxsParam_0": "aboutxasdasd",
    // "nxsParam_1": "x",
    // "nxsParam_2": "asdasd"`,
    //       { testFunction: 'nSpawn' },
    //     ],
    //   },
    {
      title: 'Naming Group',
      params: [
        'nexss Nexss/Test/Sequences --seq=2aboutxasdasd',
        `"found1":"x","found2":"a","found3":"sdasd"`,
      ],
    },
    // {
    //   title: 'Naming Group - with -seq',
    //   params: [
    //     'nexss Nexss/Test/Sequences --seq=3aboutxasdasd',
    //     `"found4":"x","found5":"a","found6":"sdasd"`,
    //   ],
    // },
    // {
    //   title: 'Data in the sequences Overwrite',
    //   params: [
    //     'nexss Nexss/Test/Sequences --seq=mytestdata',
    //     `"myparam1": "overwritten"`,
    //     { testFunction: 'nSpawn' },
    //   ],
    // },
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
}
