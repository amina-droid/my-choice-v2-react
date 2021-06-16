const FS = require('fs');
const fs = FS.promises;
const path = require('path');
const apiApollo = require('./utils');

const API_FOLDER_NAME = 'src/api/apollo';
const DICT = {
  q: 'queries',
  f: 'fragments',
  m: 'mutations',
  s: 'subscriptions'
}

const [, parserPath, type, name] = process.argv;
const folderName = DICT[type];

if (!folderName) {
  throw Error('Not found type! (q, f, m, s)')
}

const moduleName = apiApollo.toFileName(name);
const rootPath = path.join(parserPath, '../../..', API_FOLDER_NAME);

const file = apiApollo.toFilePath(folderName);
const queryName = apiApollo.toQueryName(name)
const INDEX_TEMPLATE = `export { default as ${queryName} } from './${file}';
export * from './types/${moduleName}';`
const TYPES_TEMPLATE = `export interface ${moduleName} {}
`
const EXTENDS_TEMPLATE = `export * from './${moduleName}';
`

const pathToExtends = path.join(rootPath, folderName);

const pathToModuleFolder = path.join(pathToExtends, moduleName);
const pathToModuleIndex = path.join(pathToModuleFolder, 'index');
const pathToModuleGQL = path.join(pathToModuleFolder, file);

const pathToTypesFolder = path.join(pathToModuleFolder, 'types');
const pathToTypesFile = path.join(pathToModuleFolder, 'types', moduleName);

(async function createModule() {
  try {
    await fs.mkdir(pathToModuleFolder);
    console.log(`The dir ${moduleName} was created!`);
    await fs.mkdir(pathToTypesFolder);
    console.log(`The types dir for ${moduleName} was created!`);
  
    await fs.writeFile(`${pathToTypesFile}.ts`, TYPES_TEMPLATE);
    console.log(`The types file for ${moduleName} was created!`);
  
    await fs.writeFile(`${pathToModuleIndex}.ts`, INDEX_TEMPLATE);
    console.log(`The index file for ${moduleName} was created!`);
  
    await fs.writeFile(`${pathToModuleGQL}`, '');
    console.log(`The ${file} file for ${moduleName} was created!`);
  
    await fs.appendFile(path.join(pathToExtends, 'index.ts'), EXTENDS_TEMPLATE);
    console.log(`The ${moduleName} was appended to ${folderName}!`);
  } catch (err) {
    throw err;
  }
  
  try {
  } catch (err) {
    throw err;
  }

})()
