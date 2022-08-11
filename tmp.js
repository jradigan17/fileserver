const fs = require('fs');

const dirStructure = (path) => {
  fs.readdir(path, (err, files) => {
    if (err) {
    console.log(err);
    } else {

      files.forEach(file => {

        // if(!file.includes(".")) {
          direct(file, path);
        // } else {
        // console.log(direct(file))
        // if(direct(file)) {
          // return dirStructure(file);
        
          // console.log(file);
        // }
      })
    }
  })
}

const direct = (file, path) => {
  fs.stat(`${path}/${file}`, (error, stats) => {
    // incase of error
    if (error) {
      console.error('Error:', file);
      return;
    }
    // check if path is a directory
    if (stats.isDirectory()) {
      // console.log('path = ', path, 'file =', file)
      return dirStructure(`${path}/${file}`);
    } else {
      // console.log(`\n${path} directory filenames:`);
      return console.log(`${path}/${file}`);
    }
  });
}


dirStructure('.')

