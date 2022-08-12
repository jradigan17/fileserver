const fs = require('fs');

dirStructure = (path) => {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        if (err) {
          reject(console.log(err));
        }
          // console.log(`Files available in directory :${path}\n`)
          resolve(files) 
      })
    })      
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

