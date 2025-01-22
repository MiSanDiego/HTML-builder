const path = require('node:path');
const fs = require('node:fs/promises');

const sourceFolderPath = path.join(__dirname, 'styles');
const destinationFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(destinationFilePath, '', (err) => {
  if (err) {
    console.error(err);
  }
});

transferContent();

async function transferContent() {
  const files = await fs.readdir(sourceFolderPath, { withFileTypes: true });
  files.forEach((file) => {
    if (path.extname(file.name) === '.css') {
      try {
        readWriteData(path.join(sourceFolderPath, file.name));
      } catch (err) {
        console.log('Error while read/write: ', err);
        return false;
      }
    }
  });
  console.log('CSS merged!')
}

async function readWriteData(filePath) {
  try {
    const readData = await fs.readFile(filePath, 'utf-8');
    await fs.appendFile(destinationFilePath, readData);
  } catch {
    console.log('Error while read/write');
  }

}
