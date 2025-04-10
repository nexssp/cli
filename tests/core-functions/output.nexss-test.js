module.exports = {
  nexsstests: [
    {
      title: '--nxsField',
      params: ['nexss Id --nxsAs=cuid --nxsField=cuid', /^[a-zA-Z0-9_]*$/],
    },
    {
      title: '--nxsFields',
      params: [
        'nexss Id --nxsAs=cuid --nxsFields=cuid,start',
        /{"cuid":"[a-zA-Z0-9]*","start":[0-9]*.[0-9]*}/,
      ],
    },
    {
      title: '--nxsPretty',
      params: [
        'nexss Id --nxsPretty',
        // process.platform == "win32" ? /{\n\t*"*"*/s : /^{.*nexss:..*:.*}/s,
        /{\n\t*"*"*/s,
      ],
    },
    {
      title: '--nxsConcat',
      params: [
        'nexss Id --nxsConcat="start,cwd"',
        /"nxsConcatResults":[[0-9]*.[0-9]*\,"[a-zA-Z/].*"]/,
      ],
    },
    {
      title: '--nxsGlue',
      params: [
        'nexss Id --myPath=CDE --myPath="Program Files" --nxsConcat="myPath" --nxsGlue=PATH --debug',
        /"nxsConcatResults":"CDE.*Program Files"/,
      ],
    },
    {
      title: '--nxsDelete',
      type: 'shouldNotContain',
      params: ['nexss Id --nxsDelete="cwd"', /"cwd"/],
    },
    {
      title: '--nxsRenameFrom --nxsRenameTo',
      type: 'shouldContain',
      params: [
        'nexss Id --nxsRenameFrom=cwd --nxsRenameTo=myNewVariableFromCWD',
        /"myNewVariableFromCWD"/,
      ],
    },
    {
      title: '--nxsRenameFrom --nxsRenameTo (previous value deleted)',
      type: 'shouldNotContain',
      params: [null, /"cwd"/], // null means we get result from previous test result in this queue
    },
    {
      title: '--nxsSelect',
      type: 'shouldContain',
      params: [
        'nexss Id --var1=myval1 --var1=myval2 --var1=myval3 --var1=myval4 --nxsDelete=cuid,Select_2 --nxsSelect="var1"',
        /"Select":"myval1","Select_3":"myval3","Select_4":"myval4"/,
      ],
    },
    {
      title: '--nxsSelect + --nxsDelete',
      type: 'shouldNotContain',
      params: [null, /"cuid":"*"/],
    },
    {
      title: '--nxsSelect + --nxsDelete',
      type: 'shouldNotContain',
      params: [null, /"Select_2":"*"/],
    },
    {
      title: '--nxsSelect from pipe Array',
      type: 'shouldContain',
      testProgram: 'nSpawn', // default nExec
      params:
        // For windows we remove ' from surrounded piped json
        process.platform === 'win32'
          ? [
            'echo {"array":["x","y","z"]} | nexss Id --nxsSelect=array',
            /"Select":"x","Select_2":"y","Select_3":"z"/,
          ]
          : [
            'echo \'{"array":["x","y","z"]}\' | nexss Id --nxsSelect=array',
            /"Select":"x","Select_2":"y","Select_3":"z"/,
          ],
    },
  ],
}
