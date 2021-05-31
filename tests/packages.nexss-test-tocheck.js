function getPackagesPaths(folder = '') {
  const paths = [];
  const fg = require('fast-glob');
  const languagePathArray = ['**', `*-test.nexss`];
  const path = require('path');

  // ../languages/php/win32.nexss.config.js

  paths.push(
    path
      .join(process.env.NEXSS_PACKAGES_PATH, ...languagePathArray)
      .replace(/\\/g, '/')
  );

  return fg.sync(paths);
}

const values = getPackagesPaths();
module.exports = {
  values,
  startFrom: '',
  endsWith: '',
  omit: [],
  tests: [
    {
      title: 'nexss-project',
      onError: 'stop', // global value
      tests: [
        {
          title: `nexss ${process.env.NEXSS_PACKAGES_PATH}/FS/Unpack/test.nexss/fsunpack-test.nexss --nxsPipeErrors`,
          params: [
            'nexss ${process.env.NEXSS_PACKAGES_PATH}/FS/Unpack/test.nexss/fsunpack-test.nexss --nxsPipeErrors',
            'FS/Unpack success!',
          ],
        },
      ],
    },
  ],
};
