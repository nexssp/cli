const os = require('@nexssp/os');

const linuxOmmit = [
  '.html',
  '.ahk',
  '.au3',
  '.vbs',
  '.wsf',
  '.pd',
  '.bat', // Above are not on Linux
  // ====================
  '.jl', // Julia runs on virtual machine, needs some adjustments
  '.scala', // UNICODE CHARACTERS TO FIX
  //

  // No implementation of Default and HelloWorld templates
  // TODO: Compilers works, to implement helloWorld, defaults
  '.f90',
  '.v',
  '.hs',
  '.groovy',
  '.coco',
  '.hy',
  '.bas',
  '.zig',
  '.m',
  '.adb', // !!!!!!!!
];

switch (os.name()) {
  case os.distros.UBUNTU:
    linuxOmmit.push('.ex'); // Output stops / NODEJS10
    linuxOmmit.push('.exs');
    linuxOmmit.push('.erl'); // Works but - testing shows failed.
    linuxOmmit.push('.kts'); // REMOVED COMPLETELY
    linuxOmmit.push('.dart');
    linuxOmmit.push('.clj');
    linuxOmmit.push('.raku');
    linuxOmmit.push('.d');
    break;
}

module.exports = { linuxOmmit };
