const { useBabelRc, override, addWebpackModuleRule } = require('customize-cra')

module.exports = override(
  useBabelRc(),
  addWebpackModuleRule({
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'graphql-tag/loader'
      },
    ]
  }),
);
