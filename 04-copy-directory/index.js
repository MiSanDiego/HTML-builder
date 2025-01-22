const path = require('node:path');
const fs = require('node:fs/promises');

const sourceFolderPath = path.join(__dirname, 'files');
const destinationFolderPath = path.join(__dirname, 'files-copy');

async function deleteAndCreate() {
  let fileCounter = 0;
  await fs.rm(destinationFolderPath, { force: true, recursive: true });
  await fs.mkdir(destinationFolderPath);
  const files = await fs.readdir(sourceFolderPath, { withFileTypes: true });
  try {
    files.forEach((file) => {
      const fileNameSrc = path.join(file.path, file.name);
      const fileNameDst = path.join(destinationFolderPath, file.name);
      fs.copyFile(fileNameSrc, fileNameDst);
      fileCounter++;
    });
  } catch {
    console.log('Error while coping');
    return false;
  }
  console.log(`Successfully copied ${fileCounter} files`);
}

deleteAndCreate();
