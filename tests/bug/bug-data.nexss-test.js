const { binCmd } = require("../nexss-cmd")
module.exports = {
  notEval: true, // params won't be evaluated before begin.
  nexsstests: [
    {
      title: 'Nexss/Test/Data/Flow',
      params: [
        `${binCmd} Nexss/Test/Data/Flow`,
        /(?=.*"kind":"youtube#searchListResponse")(?=.*"PythonOutput":"Hello from Python)(?=.*"phpOutput":"Hello from PHP!)(?=.*"NodeJSOutput":"Hello from NodeJS!)/ms,
        // /"kind":"youtube#searchListResponse".*"PythonOutput":"Hello from Python.*"phpOutput":"Hello from PHP!/s,
      ],
    },
  ],
}
