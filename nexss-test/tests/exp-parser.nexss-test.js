let values = ["Nexss"];

module.exports = {
  values,
  tests: [
    {
      title:
        "expression parser and json programming nexss-start\\lib\\expressionParser.js",
      tests: [
        {
          title: "exp parser JSON - .nexss file",
          params: [
            "nexss Nexss/Test/ExpressionParser/expressionParserTest.nexss",
            /"func1Result":"10"*/,
          ],
        },
        {
          title: "exp parser JSON - project",
          params: ["nexss Nexss/Test/ExpressionParser", /"func4Result":"100"/],
        },
      ],
    },
  ],
};
