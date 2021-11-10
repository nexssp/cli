module.exports = {
  defaultTestFunction: 'nSpawn',
  nexsstests: [
    {
      title: 'Check error solution define before you use it',
      params: [
        'nexss Nexss/Test/ErrorsSolutions/src/errors1.js',
        "Define 'testNotExistVariable2' before you use it.",
        { exitCode: 1 },
      ],
    },
    {
      title: "Define 'DefineBeforeUseVar' before you use it",
      params: [
        `nexss Nexss/Test/ErrorsSolutions/src/errors2.js`,
        "Possible solution 1: Define 'DefineBeforeUseVar' before you use it",
        { exitCode: 1 },
      ],
    },
    {
      title: 'Check String Solution',
      params: [
        `nexss Nexss/Test/ErrorsSolutions/src/errors3.js`,
        "Possible solution 1: Did you forget semi-colon ';' ?",
        { exitCode: 1 },
      ],
    },
  ],
}
