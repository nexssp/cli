module.exports.isURL = (url) => {
  // require("url");

  return url.startsWith("http://") || url.startsWith("https://");

  // try {
  //   return !!new URL(url);
  // } catch (error) {}
};
