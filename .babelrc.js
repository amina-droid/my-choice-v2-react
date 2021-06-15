const _ = require('lodash');

function getFileNameForApollo(str) {
  return _.upperFirst(_.camelCase(str))
}

const FOLDERS = ['queries', 'mutations', 'subscriptions'];

function getPathForApollo(folder) {
  if (FOLDERS.some((v => v === folder))) {
    return 'query.gql';
  }
  
  if (folder === 'fragments') {
    return 'fragment.gql';
  }
  
  return '';
}

module.exports = {
  plugins: [
    ['transform-imports', {
      lodash: {
        transform: 'lodash/${member}',
        preventFullImport: true
      },
      antd: {
        transform: (importName) => `antd/es/${_.kebabCase(importName)}`,
        preventFullImport: true,
      },
      '@ant-design/icons': {
        transform: '@ant-design/icons/lib/icons/${member}',
        preventFullImport: true,
      },
      'api/apollo\/?(((\\w*)?\/?)*)': {
        transform: (importName, matches) => {
          const targetName = getFileNameForApollo(importName);
          const subpart = matches[1] ? matches[1] + '/' : '';
          const type = matches[1] ? getPathForApollo(matches[1]) : '';
          
          return `api/apollo/${subpart}${targetName}${type ? '/' + type : ''}`;
        },
      },
    }]
  ]
}
