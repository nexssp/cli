module.exports = {
  nexsstests: [
    {
      title: 'exp parser JSON - .nexss file',
      params: [
        'nexss Nexss/Test/ExpressionParser/expressionParserTest.nexss',
        /"func1Result":"10"*/,
      ],
    },
    {
      title: 'exp parser JSON - project',
      params: ['nexss Nexss/Test/ExpressionParser', /"func4Result":"100"/],
    },
  ],
};
