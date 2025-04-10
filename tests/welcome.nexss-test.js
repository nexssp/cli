const { binCmd } = require("./nexss-cmd")

module.exports = {
  notEval: true, // params won't be evaluated before begin.
  nexsstests: [
    {
      params: [`${binCmd}`, /"nexss":"(\d).(\d*).(\d*)"/],
    },
  ],
}
