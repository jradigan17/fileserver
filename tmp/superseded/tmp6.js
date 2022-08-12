const fs = require('fs');

dirStructure = (path) => {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
      if (err) {
        reject(console.log(err));
      }
        console.log(`Files available in directory :${path}\n`)
        resolve(files) 
      })})      
        .then(function(files) {
          return Promise.all (files.map(function(file) {
            return new Promise((resolve, reject) => {
              fs.stat(`${path}/${file}`, (error, stats) => {
                if (error) {
                  reject(console.error('Error:', file));
                } else {
                  if (stats.isDirectory()) {
                    resolve(dirStructure(`${path}/${file}`))
                  } else {
                    resolve(console.log(`${path}/${file}`))
                  }
                }   
              })
            })
        }))
      })
    }

  




dirStructure(".").then(() => {console.log("This Should Appear at the very end")})

const dirStructure = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        return reject(console.log(err));
      } else {
        files.forEach(file => {
          return resolve(direct(file, path));
        });
      }
    });
  });
};

const direct = (file, path) => {
  fs.stat(`${path}/${file}`, (error, stats) => {
    // incase of error
    if (error) {
      console.error('Error:', file);
      return;
    }
    // check if path is a directory
    if (stats.isDirectory()) {
      return dirStructure(`${path}/${file}`);
    } else {
      return console.log(`${conColor.cyan}${path}/${file}${conColor.reset}`);
    }
  });
};