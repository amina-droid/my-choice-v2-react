const kebabCase = require('lodash/kebabCase');
const apiApollo = require('./scripts/api-apollo/utils')

module.exports = {
  plugins: [
    ['transform-imports', {
      lodash: {
        transform: 'lodash/${member}',
        preventFullImport: true
      },
      antd: {
        transform: (importName) => `antd/es/${kebabCase(importName)}`,
        preventFullImport: true,
      },
      '@ant-design/icons': {
        transform: '@ant-design/icons/lib/icons/${member}',
        preventFullImport: true,
      },
      'api/apollo\/?(((\\w*)?\/?)*)': {
        transform: (importName, matches) => {
          const targetName = apiApollo.toFileName(importName);
          const [rootFolder, file] = apiApollo.toApolloPath(matches[1]);
          
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
