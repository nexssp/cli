// TODO: Fix pipes on Windows (npm issue for passing input field? - Check bin/nexss.ps1 was working..)
let nexsstests = [
  {
    title: "Long Pipe",
    params: [
      "nexss Id --nxsAs=MY1 | nexss Id --nxsAs=MY2 | nexss Id --nxsAs=MY3 | nexss Id --nxsAs=MY4 | nexss Id --nxsAs=MY5 | nexss Id --nxsAs=MY6",
      /"MY1":".*".*"MY2":".*".*"MY3":".*".*"MY4":".*".*"MY5":".*".*"MY6":".*"/,
    ],
  },
];

// if (process.platform === "win32") {
//   nexsstests = [];
// }

module.exports = {
  nexsstests,
};
