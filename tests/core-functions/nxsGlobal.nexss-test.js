module.exports = {
  nexsstests: [
    {
      title: "--nxsGlobal (1)",
      params: ["nexss Id --x=1 --_y=369x --nxsGlobal=y", /"y":"369x"/],
    },
    {
      title: "--nxsGlobal (multiple)",
      params: [
        "nexss Id --x=1 --_y=369123x --_w=369456y --nxsGlobal=y,w",
        /"y":"369123x","w":"369456y"/,
      ],
    },
    {
      title: "--nxsGlobal (multiple 2)",
      params: [
        // order is important
        "nexss Id --x=1 --_y=369123x --_w=369456y --nxsGlobal=y --nxsGlobal=w",
        /"y":"369123x","w":"369456y"/,
      ],
    },
    {
      title: "--nxsGlobal no nxsForce",
      params: [
        // order is important
        "nexss Id --x=1 --_y=369123x --_w=369456y --nxsGlobal=x --nxsGlobal=w",
        /nxsGlobal:Local var '_x' does not exist. Remove nxsGlobal=x/,
      ],
    },
    {
      title: "--nxsGlobal --nxsGlobalForce",
      params: [
        // order is important
        "nexss Id --x=1 --_y=369123x --_w=369456y --nxsGlobal=x --nxsGlobal=w --nxsGlobalForce",
        /nxsGlobal:Local var '_x' does not exist. Remove nxsGlobal=x/,
      ],
    },
  ],
};
