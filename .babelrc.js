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

function getApolloFolderPath(folderName) {
  if (folderName) {
    const rootFolder = folderName;
    const file = getPathForApollo(folderName);
    
    return [rootFolder, file];
  }
  
  return ['', ''];
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
          const [rootFolder, file] = getApolloFolderPath(matches[1]);
          
          let path = '';
          
          if (rootFolder) {
            path += `/${rootFolder}`
          }
          
          path += `/${targetName}`;
          
          if (file) {
            path += `/${file}`
          }
          
          return `api/apollo${path}`;
        },
      },
    }]
  ]
}
