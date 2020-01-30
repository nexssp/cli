let values = ["Nexss"];

module.exports = {
  values,
  startFrom: "",
  endsWith: "",
  omit: [],
  tests: [
    {
      title: "nexss-project",
      onError: "stop", // global value
      tests: [
        {
          title: "Create New Project",
          params: [
            "nexss project new MyTestProject -f",
            "SUCCESS  Project 'MyTestProject' is ready."
          ]
        },
        {
          title: "Add file to the Project",
          type: "shouldContain",
          params: [
            "nexss file add myfile1.js -f -t=helloWorld",
            `File src\\\\myfile1.js has been created.`,
            {
              chdir: "MyTestProject"
            }
          ]
        },
        {
          title: "Display Project info",
          params: ["nexss p i", `Name: MyTestProject`]
        },
        {
          title: "Add file to the Project (already exists)",
          params: [
            "nexss file add myfile1.js",
            `File already exists: myfile1.js`
          ]
        },
        {
          title: "Add file to the Project (forced)",
          params: [
            "nexss file add myfile1.js -f -t=helloWorld",
            `OK  File src\\\\myfile1.js has been created.\\nSUCCESS  Done.`
          ]
        },
        {
          title: "Check project info",
          params: ["nexss project info", `Current Project`]
        },
        {
          title: "Check",
          params: [
            `nexss p a --keywords="mykeyword1,mykeyword2" --description="description" --repo="repository" --editor="editor" --note="note"`,
            `INFO  This is Nexss PROGRAMMER project.
INFO  Project name: MyTestProject
INFO  Description: description
INFO  Keywords: mykeyword1,mykeyword2
INFO  Repo: repository
INFO  Editor: editor
INFO  Note: note`
          ]
        }
      ]
    }
    // {
    //   title: "nexss-command",
    //   onError: "stop", // global value
    //   tests: [
    //     {
    //       title: "Check not in the folder",
    //       type: "shouldContain",
    //       params: [
    //         "nexss cmd",
    //         "You are not in the Nexss Programmer project folder."
    //       ]
    //     }
    //   ]
    // }
  ]
};
