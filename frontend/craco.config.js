// eslint-disable-next-line @typescript-eslint/no-var-requires
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1890FF',
              '@font-family': 'Rubik, sans-serif',
              '@typography-title-font-weight': 500,
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
