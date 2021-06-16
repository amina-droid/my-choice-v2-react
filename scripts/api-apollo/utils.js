const _ = require('lodash');

const FOLDERS = ['queries', 'mutations', 'subscriptions'];
function toFilePath(folder){
  if (FOLDERS.some((v => v === folder))) {
    return 'query.gql';
  }
  
  if (folder === 'policies') {
    return 'index'
  }
  
  if (folder === 'fragments') {
    return 'fragment.gql';
  }
  
  return '';
}

module.exports = {
  toFileName: (str) => _.upperFirst(_.camelCase(str)),
  toFilePath,
  toQueryName: (str) => _.toUpper(_.snakeCase(str)),
  toApolloPath: (folder) => {
    if (folder) {
      const rootFolder = folder;
      const file = toFilePath(folder);
    
      return [rootFolder, file];
    }
  
    return ['', ''];
  }
}
