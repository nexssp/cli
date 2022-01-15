const displayMarkdown = (content) => {
  const { toTerminal } = require('@nexssp/markdown')
  console.info(toTerminal(content))
}

module.exports = { displayMarkdown }
