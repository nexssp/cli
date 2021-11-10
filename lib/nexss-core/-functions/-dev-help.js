module.exports = () => {
  const ansi = require('@nexssp/ansi')
  const { getConstants } = require('@nexssp/const')
  let result = ''
  result += bold(yellow('Constants:\n'))
  let x = 0
  for (const constant of getConstants()) {
    const color = ansi.colors[x]

    // result += `${ansi[color](constant.name)}` + ", ";
    result += `${constant.name}` + ', '
    x++
  }
  process.stdout.write(`${result}\n`)
}
