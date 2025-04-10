const { binCmd } = require("./nexss-cmd")

module.exports = {
  nexsstests: [
    // Add Request test eg:  nexss https://nexss.com / file: transformRequest.js

    // {
    //   title: "",
    //   params: [
    //     "nexss Id --ABC='${fs.existsSync(\"KBDHAW.DLL\")}' --y='${nConst(\"xxx\",\"Works\")}' --final='${xxx}' --zzz='${(xxx = 555)}'",
    //     "cc",
    //   ],
    // },
    {
      title: 'Run depends on platform .nexss file',
      params: [
        `${binCmd} Nexss/Test/Platform/example1.nexss --nxsPipeErrors`,
        process.platform === 'win32'
          ? 'This command will appear only on All Windowses'
          : process.platform === 'linux'
            ? 'This command will appear only on Linux distros'
            : 'This command will appear only on Windows10 OR macOS.', // add MacOS later
      ],
    },
    {
      title: 'Run depends on platform - exitCode 1 for Windows',
      params: [
        `${binCmd} Output/End "works on Linux" --nxsPlatform="LINUX"`,
        process.platform === 'win32'
          ? 'LINUX did not match with your platform win32'
          : process.distroTag2 === 'Ubuntu'
            ? 'works on Linux'
            : '',
        {
          exitCode: process.platform === 'win32' || process.platform === 'darwin' ? 1 : 0, // Checks if the number of error code
          testFunction: 'nSpawn',
        },
      ],
    },
    {
      title: 'Run depends on platform - exitCode 0',
      params: [
        `${binCmd} Output/End "works on Ubuntu" --platform:check="UBUNTU" --platform:noerror`,
        process.platform === 'win32'
          ? 'UBUNTU did not match with your platform win32'
          : process.distroTag2 === 'Ubuntu'
            ? 'works on Ubuntu'
            : '',
        {
          exitCode: 0, // Checks if the number of error code
          testFunction: 'nSpawn',
        },
      ],
    },
    // ##################################################
    {
      title: 'Thest calculations field with $#',
      params: [`${binCmd} Id --pi='x${Math.PI}zzz' --nxsAs = A`, 'x3.141592653589793zzz'],
    },
    {
      title: 'Thest calculations field with package',
      params: [`${binCmd} $# 'x${Math.PI}zzz' --nxsAs = B`, 'x3.141592653589793zzz'],
    },
  ],
}
