module.exports = {
  defaultTestFunction: 'nSpawn',
  nexsstests: [
    {
      title: 'Create New Project',
      params: ['nexss project new MyTestProject -f', "SUCCESS Project 'MyTestProject' is ready"],
    },

    {
      title: 'Add file to the Project',
      type: 'shouldContain',
      params: [
        'nexss file add myfile1.js -f -t=helloWorld',
        `myfile1.js has been created.`,
        {
          // chdir: "MyTestProject", // only once will change dir
          keepchdir: 'MyTestProject', // will keep changing dir on the next tests.
        },
      ],
    },
    {
      title: 'Display Project info',
      params: ['nexss p i', /Name: MyTestProject.*myfile1\.js/s],
    },
    {
      testProgram: 'nExec',
      title: 'Add file to the Project (already exists)',
      params: [
        'nexss file add myfile1.js --x=1',
        `File already exists: myfile1.js`,
        { exitCode: 1, chdir: 'MyTestProject' } /*Keep eye on keepChdir*/,
      ],
    },
    {
      title: 'Add file to the Project (forced)',
      params: ['nexss file add myfile1.js -f -t=helloWorld', `myfile1.js has been created.`],
    },
    {
      title: 'Check project info',
      params: ['nexss project info', `Current Project`],
    },
    {
      title: 'Check project attach to nexss db',
      params: [
        `nexss p a --force --keywords="mykeyword1,mykeyword2" --description="description" --repo="repository" --editor="editor" --note="note"`,
        `INFO Attaching project from current folder`,
      ],
    },
    {
      title: 'Search Project',
      params: [`nexss p search MyTestProject`, `MyTestProject NEXSSP`],
    },
    {
      title: 'Remove project from nexss db / Project not exists',
      params: [`nexss p remove not-exists-project`, `project not-exists-project does not exist`],
    },
    {
      title: 'Remove test project from nexss db / Project EXIST',
      params: [`nexss p remove MyTestProject`, `SUCCESS Done..`],
    },
  ],
}
