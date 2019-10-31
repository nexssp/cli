// To implement ?? https://github.com/mafintosh/turbo-json-parse

const json = {
  read() {},
  write() {},
  parseJSON(data) {
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch (e) {
      // if (
      //   e.message.indexOf("Unexpected token") < 0 &&
      //   e.message.indexOf("JSON at position 0") < 0
      // ) {
      //   console.warn(`String ${this.data} couldn't be parsed as JSON.`);
      //   console.warn(e.message);
      // }
      return { notjson: data.trim() };
    }
  },
  stringify() {}
};

module.exports = json;
