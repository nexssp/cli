module.exports = {
  nexsstests: [
    {
      title: "Create New Project",
      params: [
        "nexss project new MyTestProject -f",
        "SUCCESS  Project 'MyTestProject' is ready.",
      ],
    },

    {
      title: "Add file to the Project",
      type: "shouldContain",
      params: [
        "nexss file add myfile1.js -f -t=helloWorld",
        `myfile1.js has been created.`,
        {
          chdir: "MyTestProject",
        },
      ],
    },
    {
      title: "Display Project info",
      params: ["nexss p i", `Name: MyTestProject`],
    },
    {
      title: "Add file to the Project (already exists)",
      params: ["nexss file add myfile1.js", `File already exists: myfile1.js`],
    },
    {
      title: "Add file to the Project (forced)",
      params: [
        "nexss file add myfile1.js -f -t=helloWorld",
        `myfile1.js has been created.\\nSUCCESS  Done.`,
      ],
    },
    {
      title: "Check project info",
      params: ["nexss project info", `Current Project`],
    },
    {
      title: "Check project attach to nexss db",
      params: [
        // if to force
        `nexss p a --force --keywords="mykeyword1,mykeyword2" --description="description" --repo="repository" --editor="editor" --note="note"`,
        `INFO  Attaching project from current folder`,
      ],
    },
    {
      title: "Search Project",
      params: [
        // if to force
        `nexss p search MyTestProject`,
        `MyTestProject NEXSSP`,
      ],
    },
    {
      title: "Remove project from nexss db / Project not exists",
      params: [
        // if to force
        `nexss p remove not-exists-project`,
        `project not-exists-project does not exist`,
      ],
    },
    {
      title: "Remove test project from nexss db / Project EXIST",
      params: [`nexss p remove MyTestProject`, `SUCCESS  Done..`],
    },
  ],
};
