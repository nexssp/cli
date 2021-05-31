const { readFileSync } = require('fs');

module.exports.stdin = () => {
  const chunks = [];
  try {
    do {
      var chunk = readFileSync(0, 'utf8');
      chunks.push(chunk);
    } while (chunk.length);
  } catch (error) {}
  return chunks.join('');
};
