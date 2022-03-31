// FIXME: This shows bugs from sequences.nexss-test.js on github-actions workflow.
//

module.exports = {
  nexsstests: [
    {
      // Parameters are passed
      title: 'Capture Group',
      params: [
        'nexss Nexss/Test/Sequences --seq=aboutxasdasd',
        `"nxsParam_0": "aboutxasdasd",
    "nxsParam_1": "x",
    "nxsParam_2": "asdasd"`,
        { testFunction: 'nSpawn' },
      ],
    },
  ],
}
