module.exports.displayMarkdown = (content) => {
  let marked = require("marked");
  let TerminalRenderer = require("marked-terminal");

  marked.setOptions({
    // Define custom renderer
    renderer: new TerminalRenderer(),
  });

  console.info(marked(content));
};
