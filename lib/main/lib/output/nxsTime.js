let counter = 0
const icons = ['∑']
module.exports.timeElapsed = (hrTime, title = 'Execution time (hr)') => {
  if (hrTime) {
    const hrend = process.hrtime(hrTime)
    const color = '\x1b[100m' // grey
    if (title === 'Execution time (hr)') {
      process.stdout.write('\n')
    }

    log.info(greenBG(`${icons[counter]} : ${title}: ${hrend[0]}s ${hrend[1] / 1e6}ms\x1b[0m`))
  }

  counter++
  if (counter === icons.length) {
    counter = 0
  }
}
