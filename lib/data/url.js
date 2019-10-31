module.exports.isURL = url => {
  require("url");
  try {
    return !!new URL(url);
  } catch (error) {}
};
