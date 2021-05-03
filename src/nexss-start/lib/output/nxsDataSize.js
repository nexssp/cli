module.exports.dataSize = (data) => {
  if (data) {
    let color = "\u001b[43;1m"; //grey
    console.error(
      `Data size: ${color} ${JSON.stringify(data).length} B OR ${(
        JSON.stringify(data).length / 1024
      ).toFixed(2)} KB\x1b[0m`
    );
  }
};
