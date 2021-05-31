const helpDisplay =
  /nexss command(.*)nexss config(.*)nexss file(.*)nexss language(.*)nexss project(.*)/s
// const helpDisplay =
//   /nexss command[\s\S]*nexss config[\s\S]*nexss file[\s\S]*nexss language[\s\S]*nexss project[\s\S]*/
module.exports = {
  nexsstests: [
    {
      title: 'Help display',
      params: ['nexss help', helpDisplay],
    },
    {
      title: 'Help display - with an alias (src/aliases.js)',
      params: ['nexss h', helpDisplay],
    },
    {
      title: 'Help per core package',
      params: ['nexss file add help', /Adds a new file to the project \(with template selection\)/],
    },
    {
      title: 'Help per core',
      params: ['nexss package help', /package add/],
    },
    {
      title: 'Help per package',
      params: ['nexss Id help', /Generates unique id/],
    },
  ],
}
