module.exports = {
  defaultTestFunction: 'nSpawn',
  nexsstests: [
    {
      title: '--nxsLocal (1)',
      params: ['nexss Debug --x=369x --_y=369234x --nxsLocal=x', /"_x": "369x"/],
    },
    {
      title: '--nxsLocal (multiple)',
      params: [
        'nexss Debug --x=369w --c=369wc --_y=369123x --_w=369456y --nxsLocal=x,c',
        `  "_x": "369w",
  "_c": "369wc"`,
      ],
    },
    {
      title: '--nxsLocal (multiple)',
      params: [
        'nexss Debug --x=369w --c=369wc --_y=369123x --_w=369456y --nxsLocal=x --nxsLocal=c',
        `  "_x": "369w",
  "_c": "369wc"`,
      ],
    },
    {
      title: '--nxsLocal no nxsForce',
      params: [
        // order is important
        'nexss Debug --x=1 --_x=1234 --_y=369123x --_w=369456y --nxsLocal=x',
        /You have used nxsLocal however there is data with name x already/,
      ],
    },
    {
      title: '--nxsLocal var does not exist',
      params: [
        // order is important
        'nexss Debug --x=1 --_y=369123x --_w=369456y --nxsLocal=x --nxsLocal=w --nxsLocalForce',
        /nxsLocal:Global var 'w' does not exist. Remove nxsLocal=w/,
      ],
    },
    {
      title: '--nxsLocal --nxsLocalForce',
      params: [
        // order is important
        'nexss Debug --y=369w --_y=369123x --_w=369456y --nxsLocal=y --nxsLocalForce',
        `  "_y": "369w",
  "_w": "369456y"`,
      ],
    },
  ],
}
