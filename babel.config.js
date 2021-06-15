const camelCase = require('lodash/camelCase');
const upperFirst = require('lodash/upperFirst')

function getFileNameForApollo(str) {
  return upperFirst(camelCase(str))
}

module.exports = {
  plugins: [
    ['transform-imports', {
      lodash: {
        transform: 'lodash/${member}',
        preventFullImport: true
      },
      antd: {
        transform: (importName) => `antd/es/${importName.toLowerCase()}`,
        preventFullImport: true,
      },
      '@ant-design/icons': {
        transform: '@ant-design/icons/lib/icons/${member}',
        preventFullImport: true,
      },
      'api/apollo\/?(((\\w*)?\/?)*)': {
        transform: (importName, matches) => {
          return `api/apollo/${matches}/${getFileNameForApollo(importName)}`;
        },
        preventFullImport: true,
      },
    }]
  ]
}
