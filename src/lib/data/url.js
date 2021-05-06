module.exports.isURL = (url) => {
  // require("url");
  if (!url.startsWith) return false;
  return url.startsWith("http://") || url.startsWith("https://");

  // try {
  //   return !!new URL(url);
  // } catch (error) {}
};
