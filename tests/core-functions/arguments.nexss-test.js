const { binCmd } = require("../nexss-cmd")
module.exports = {
  notEval: true, // params won't be evaluated before begin.
  nexsstests: [
    {
      title: 'Pass arguments to the file',
      params: [
        `${binCmd} Nexss/Test/Arguments/testArgs.js --x=1 mytestarg --y=2 mysecondarg`,
        /"test":\[.*"--x=1","mytestarg","--y=2","mysecondarg"/,
      ],
    },
    {
      title: 'Pass arguments in the project .nexss file',
      params: [`${binCmd} Nexss/Test/Arguments`, /"test":\[.*"--myvar=5","x","y","z"\]/],
    },
    // {
    //   title: 'Save to file(s) myfile1.txt and myfile2.txt',
    //   params: ['nexss Nexss/Test/Arguments/test.nexss', /dsdasd/],
    // },
    // {
    //   type: 'fileHasContent',
    //   title: 'Pass arguments in .nexss file and save.',
    //   params: ['myfile1.txt', /fileHasContent/],
    // },
    // {
    //   type: 'fileHasContent',
    //   title: 'Pass arguments in .nexss file and save.',
    //   params: ['myfile2.txt', /fileHasContent/],
    // },
  ],
}
