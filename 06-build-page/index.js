const fs = require('fs');
const promises = fs.promises;
const path = require('path');



function createDir() {
  const pathtoDist = path.resolve(__dirname, 'project-dist');
  promises.mkdir(pathtoDist, { recursive: true });
}

function createHtml() {
  const pathToInput = path.resolve(__dirname, 'template.html');
  const input = fs.createReadStream(pathToInput, 'utf-8');
  const pathToOutput = path.resolve(__dirname, 'project-dist', 'index.html');
  input.on('data', data => {
    let htmlToString = data.toString();

    const pathComponents = path.resolve(__dirname, 'components');
    const objInFolder = promises.readdir(pathComponents, {withFileTypes: true});
    objInFolder.then(files => files.forEach(file => {
    if (file.isFile()) {
      const pathToFile = path.resolve(__dirname, 'components', file.name);
      const fileName = path.basename(pathToFile);
      const extFile = path.extname(pathToFile);
      const onlyName = fileName.replace(extFile, '');
      const input = fs.createReadStream(pathToFile, 'utf-8');
      input.on('data', data => {
        const output = fs.createWriteStream(pathToOutput);
        const component = data.toString();
        
        htmlToString = htmlToString.replace(`{{${onlyName}}}`, component);
        output.write(htmlToString);
      })
      }
    })
    )
  }) 
}

function createCss() {
  const pathToStyles = path.resolve(__dirname, 'styles');
  const objInFolder = promises.readdir(pathToStyles, {withFileTypes: true});
  const pathToBundle = path.resolve(__dirname, 'project-dist', 'style.css');
  const output = fs.createWriteStream(pathToBundle);
  objInFolder.then(files => files.forEach(file => {
    if (file.isFile()) {
      const pathToFile = path.resolve(__dirname, 'styles', file.name);
      const extFile = path.extname(pathToFile);
      if (extFile === '.css') {
        const input = fs.createReadStream(pathToFile, 'utf-8');
        input.on('data', data => {
          output.write(data.toString() + '\n');
        }) 
      }
    }
  })
  )
}

async function copyAssets(pathDir, pathCopyDir) {
  let pathFolder = '';
  let pathCopyFolder = '';
  if (!pathDir && !pathCopyDir) {
    pathFolder = path.resolve(__dirname, 'assets');
    pathCopyFolder = path.resolve(__dirname, 'project-dist', 'assets');
  } else {
    pathFolder = pathDir;
    pathCopyFolder = pathCopyDir;
  }
  promises.mkdir(pathCopyFolder, { recursive: true });
  const objInFolder = promises.readdir(pathFolder, {withFileTypes: true});
  objInFolder.then(files => files.forEach(file => {
    const pathToFile = path.resolve(pathFolder, file.name);
    const pathToCopyFile = path.resolve(pathCopyFolder, file.name);

    if (file.isFile()) {
      promises.copyFile(pathToFile, pathToCopyFile);
    } else if (file.isDirectory()) {
      pathFolder = path.resolve(__dirname, 'assets', file.name);
      pathCopyFolder = path.resolve(__dirname, 'project-dist', 'assets', file.name);
      copyAssets(pathFolder, pathCopyFolder);
    }
  })
  )  
}

function clearAsset() {
  const pathCopyFolder = path.resolve(__dirname, 'project-dist', 'assets');
  fs.rm(pathCopyFolder, { recursive: true, force: true }, (err) => {
    if ( err ) {
      console.error(err.message);
      return;
    }
    copyAssets();
})
}

function startBndle() {
  createDir();
  createCss();
  createHtml();
  clearAsset();
  console.log('==================================\nThe bundle.css has been generated!\n==================================');
};

startBndle();



