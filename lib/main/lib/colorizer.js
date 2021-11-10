module.exports.colorizer = (txt) => {
  if (txt.startsWith('OK')) {
    return green(txt)
  }
  if (txt.startsWith('INFO')) {
    return bold(txt)
  }
  if (txt.startsWith('WARN')) {
    return yellow(txt)
  }

  return txt
}
