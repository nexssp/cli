module.exports = {
  "Cannot find module '(.*?)'": "nexss js install <package>",
  "Cannot open include file: 'dns_sd.h'": `Do you have bonjour SDK installed? 
https://developer.apple.com/download/more/
(Remember to restart your computer after installation.)`
};
// LINUX:
//  "Cannot open include file: 'dns_sd.h'": {
//       win32:
//         "Do you have bonjour SDK installed (Remember to restart your computer after installation.)? https://developer.apple.com/download/more/",
//       darwin: "native? or edit error in " + __dirname,
//       linux: "apt-get install -y libavahi-compat-libdnssd-dev"
//     }
