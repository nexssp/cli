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
      title: "Run depends on platform .nexss file",
      params: [
        "nexss Nexss/Test/Platform/example1.nexss",
        process.platform === "win32"
          ? "This command will appear only on All Windowses"
          : "This command will appear only on Linux distros", // add MacOS later
      ],
    },
    {
      title: "Run depends on platform",
      params: [
        "nexss Output/End 'works on Ubuntu' --nxsPlatform='UBUNTU'",
        process.platform === "win32"
          ? "'UBUNTU' did not match with your platform win32"
          : process.distroTag2 === "Ubuntu"
          ? "works on Ubuntu"
          : "",
      ],
    },
    // ##################################################
    {
      title: "Thest calculations field with $#",
      params: [
        "nexss Id --pi='x\\${Math.PI}zzz' --nxsAs=A",
        "x3.141592653589793zzz",
      ],
    },
    {
      title: "Thest calculations field with package",
      params: [
        "nexss $# 'x\\${Math.PI}zzz' --nxsAs=A",
        "x3.141592653589793zzz",
      ],
    },
  ],
};
