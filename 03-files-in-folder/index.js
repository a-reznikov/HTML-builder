const fs = require('fs');
const promises = fs.promises;
const path = require('path');

const pathFolder = path.resolve(__dirname, 'secret-folder');
const objInFolder = promises.readdir(pathFolder, {withFileTypes: true});
objInFolder.then(files => files.forEach(file => {
  if (file.isFile()) {
    const pathToFile = path.resolve(__dirname, 'secret-folder', file.name);
    const fileName = path.basename(pathToFile);
    const extFile = path.extname(pathToFile);
    const statFiles = promises.stat(pathToFile);
    statFiles.then(stat => {
      const onlyName = fileName.replace(extFile, '');
      const onlyExt = extFile.replace('.', '');
      const sizeKb = +(stat.size / 1024).toFixed(3);
      console.log(`${onlyName} - ${onlyExt} - ${sizeKb}kb`);
    })
  }
})
)