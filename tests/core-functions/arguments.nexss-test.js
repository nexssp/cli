module.exports = {
  notEval: true, // params won't be evaluated before begin.
  nexsstests: [
    {
      title: 'Pass arguments to the file',
      params: [
        'nexss Nexss/Test/Arguments/testArgs.js --x=1 mytestarg --y=2 mysecondarg',
        /"test":\[.*"--x=1","mytestarg","--y=2","mysecondarg"/,
      ],
    },
    {
      title: 'Pass arguments in the project .nexss file',
      params: ['nexss Nexss/Test/Arguments', /"test":\[.*"--myvar=5","x","y","z"\]/],
    },
  ],
}
