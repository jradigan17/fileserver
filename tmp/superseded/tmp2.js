const fs = require('fs');
const promises = [];

async function start(files, path) {
  for await (let file of files) {
    // files.forEach(file => {
      promises.push(
  fs.stat(`${path}/${file}`, (error, stats) => {

    if (error) {
      reject(console.error('Error:', file));
      return;
    }
    if (stats.isDirectory()) {
      new Promise ((resolve, reject) => resolve(dirStructure(`${path}/${file}`)));
    } else {
      console.log(`${path}/${file}`);
    }
  })
      )
}
}

const dirStructure = (path) => {
  fs.readdir(path, (err, files) => {
    if (err) {
    reject(console.log(err));
    } else {
      console.log(`Files available in directory ${path}:\n`)
      start(files, path)

      
       
      // .then(() => console.log("This Actually Worked"))
      // }
    }
  })
  }

dirStructure('.')

Promise.all(promises).then(() => console.log("This Should Appear at the very end"));


