module.exports = [
  {
    match: /\$\{e:/g,
    replace: '${process.env.',
  },
];
