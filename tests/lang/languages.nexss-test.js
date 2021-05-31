const { join } = require('path')

// TODO:get langs from @nexssp/languages
let languages = require(join(__dirname, '../../lib/', 'nexss-language', 'repos.json'))

let languageExtensions = Object.keys(languages)

languageExtensions = languageExtensions.reduce((acc, lang) => {
  console.log(lang)
  if (!require('./languages-windows.config').windowsOmmit.includes(lang)) {
    return acc.concat(lang)
  }
  return acc
  // console.log(acc)
  // return acc
}, [])

module.exports = {
  uniqueTestValues: languageExtensions,
  testsSelect: [1, 2],
  startFrom: null, // eg. .cs
  endsWith: null, // eg .cs
  omit:
    process.platform === 'win32'
      ? require('./languages-windows.config').windowsOmmit
      : require('./languages-linux.config').linuxOmmit,
  nexsstests: [
    {
      title: 'Creating file for ${uniqueTestValue}',
      type: 'shouldContain',
      params: [
        'nexss file add Default${uniqueTestValue} --t=default --f',
        /OK File (.*) has been created/,
      ],
    },
    {
      title: 'Test without Unicode',
      type: 'shouldContain',
      params: ['nexss Default${uniqueTestValue}', /"test":(.*)"test"/],
    },
    {
      title: 'Test Unicode characters',
      type: 'shouldContain',
      params: ['nexss Default${uniqueTestValue} --nxsTest', /"test":(.*)"test"/],
    },
  ],
}
