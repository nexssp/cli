module.exports = () => {
  const { colors } = require('@nexssp/ansi');

  Object.values(colors).forEach((e) => {
    if (
      [
        'yellowBG',
        'yellowBG2',
        'blueBG',
        'blueBG2',
        'orangeBG',
        'greenBG2',
        'cyanBG',
        'whiteBG',
      ].includes(e)
    ) {
      process.stdout.write(black(`${global[e](e)}  `));
    } else if (['black'].includes(e)) {
      process.stdout.write(`${global[e](whiteBG(e))}  `);
    } else {
      process.stdout.write(`${global[e](e)}  `);
    }
  });
};
