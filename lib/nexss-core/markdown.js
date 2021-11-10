module.exports.displayMarkdown = (content) => {
  const marked = require('marked')
  const TerminalRenderer = require('marked-terminal')

  marked.setOptions({
    // Define custom renderer
    renderer: new TerminalRenderer(),
  })

  console.info(marked(content))
}
