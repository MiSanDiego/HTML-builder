const path = require('node:path');
const fs = require('node:fs/promises');
const { error } = require('node:console');

const sourceFolderPath = path.join(__dirname, 'files');
const destinationFolderPath = path.join(__dirname, 'project-dist');
const componentsFolder = path.join(__dirname, 'components');

const sourceStylesFolderPath = path.join(__dirname, 'styles');
const destinationStylesFilePath = path.join(destinationFolderPath, 'styles.css');

const sourceAssetsFolderPath = path.join(__dirname, 'assets');
const destinationAssetsFilePath = path.join(destinationFolderPath, 'assets');

async function createDirectory() {
  await fs.rm(destinationFolderPath, { force: true, recursive: true });
  await fs.mkdir(destinationFolderPath);
}

async function readFolder(folderPath) {
  const files = await fs.readdir(folderPath, { withFileTypes: true });
  return files.map((file) => file.name);
}

async function main() {
  await createDirectory();
  const files = await readFolder(componentsFolder);
  let template = await fs.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  for (let file of files) {
    const fileName = path.parse(file).name;
    const fileContent = await fs.readFile(path.join(componentsFolder, file), 'utf-8');
    template = template.replace(`{{${fileName}}}`, fileContent);
  }
  createFileAndFill(path.join(destinationFolderPath, 'index.html'), template);
  await transferContentCss();
  await copyFolders(sourceAssetsFolderPath, destinationAssetsFilePath);
}

main()

async function createFileAndFill(destinationFilePath, content) {
  await fs.writeFile(destinationFilePath, content, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

async function transferContentCss() {

  await fs.writeFile(destinationStylesFilePath, '', (err) => {
    if (err) {
      console.error(err);
    }
  });

  const files = await fs.readdir(sourceStylesFolderPath, { withFileTypes: true });
  files.forEach((file) => {
    if (path.extname(file.name) === '.css') {
      try {
        readWriteDataCss(path.join(sourceStylesFolderPath, file.name));
      } catch (err) {
        console.log('Error while read/write: ', err);
        return false;
      }
    }
  });
  console.log('CSS merged!')
}

async function readWriteDataCss(filePath) {
  try {
    const readData = await fs.readFile(filePath, 'utf-8');
    await fs.appendFile(destinationStylesFilePath, readData);
  } catch {
    console.log('Error while read/write');
  }

}

async function copyAssets() {
  let fileCounter = 0;
  await fs.rm(destinationAssetsFilePath, { force: true, recursive: true });
  await fs.mkdir(destinationAssetsFilePath);
  const files = await fs.readdir(sourceAssetsFolderPath, { withFileTypes: true });
  try {
    files.forEach((file) => {
      const fileNameSrc = path.join(file.path, file.name);
      const fileNameDst = path.join(destinationAssetsFilePath, file.name);
      fs.copyFile(fileNameSrc, fileNameDst);
      fileCounter++;
    });
  } catch {
    console.log('Error while coping');
    return false;
  }
}

async function copyFolders(srcFolder, dstFolder) {
  await fs.rm(dstFolder, { force: true, recursive: true });
  await fs.mkdir(dstFolder);

  try {
    await fs.cp(srcFolder, dstFolder, { recursive: true });
    console.log('directory copied');
  } catch (err) {
    console.log(err);
  }
  // httpServer();
}

async function httpServer() {
  const http = require('node:http');
  const createReadStream = require('fs').createReadStream;
  const server = await http.createServer((req, resp) => {
    resp.writeHead(200, { 'Content-Type': 'text/html' });
    createReadStream(path.join(destinationFolderPath, 'index.html')).pipe(resp);
  });
  
  server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}

