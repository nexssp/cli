const { binCmd } = require("./nexss-cmd")

module.exports = {
  nexsstests: [
    {
      title: 'exp parser JSON - .nexss file',
      params: [
        `${binCmd} Nexss/Test/ExpressionParser/expressionParserTest.nexss`,
        /"func1Result":"10"*/,
      ],
    },
    {
      title: 'exp parser JSON - project',
      params: [`${binCmd} Nexss/Test/ExpressionParser`, /"func4Result":"100"/],
    },
  ],
}
