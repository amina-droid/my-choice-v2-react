const FS = require('fs');
const fs = FS.promises;
const path = require('path');
const apiApollo = require('./utils');

const API_FOLDER_NAME = 'src/api/apollo';
const FOLDER_DICT = {
  q: 'queries',
  f: 'fragments',
  m: 'mutations',
  s: 'subscriptions'
}

const QUERY_DICT = {
  q: 'query',
  f: 'fragment',
  m: 'mutation',
  s: 'subscription'
}

const [, parserPath, type, name] = process.argv;
const folderName = FOLDER_DICT[type];

if (!folderName) {
  throw Error('Not found type! (q, f, m, s)')
}

const moduleName = apiApollo.toFileName(name);
const rootPath = path.join(parserPath, '../../..', API_FOLDER_NAME);

const file = apiApollo.toFilePath(folderName);
const queryName = apiApollo.toQueryName(name);

// templates
const INDEX_TEMPLATE = `export { default as ${queryName} } from './${file}';
export * from './types/${moduleName}';`
const TYPES_TEMPLATE = `export interface ${moduleName} {}
`
const EXTENDS_TEMPLATE = `export * from './${moduleName}';`
const QUERY_TEMPLATE = `${QUERY_DICT[type]} ${moduleName} {
}`

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
  
    await fs.writeFile(`${pathToModuleGQL}`, QUERY_TEMPLATE);
    console.log(`The ${file} file for ${moduleName} was created!`);
    
    const indexPath = path.join(pathToExtends, 'index.ts');
    const indexFile = await fs.readFile(indexPath, 'utf8');
    const importsStrings = indexFile.split('\n').filter(Boolean);
    importsStrings.push(EXTENDS_TEMPLATE);
    await fs.writeFile(indexPath, importsStrings.sort().join('\n') + '\n');
    console.log(`The ${moduleName} was appended to ${folderName}!`);
  } catch (err) {
    throw err;
  }
})()
