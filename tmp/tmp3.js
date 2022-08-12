const fs = require('fs');

Promise.allSettled( [new Promise((resolve, reject) => {
(dirStructure = (path) => {
  // return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(console.log(err));
      } else {
        console.log(`Files available in directory :${path}\n`)
        for (let i = 0; i < files.length; i++) {
          fs.stat(`${path}/${files[i]}`, (error, stats) => {
            if (error) {
              reject(console.error('Error:', files[i]));
              return;
            } else {
              if (stats.isDirectory()) {
                return (dirStructure(`${path}/${files[i]}`));
              } else {
                console.log(`${path}/${files[i]}`)
                if (i === files.length - 1) resolve()
              }
            }
          })
        }
        // return resolve()
      }
    }) 
  })(".");
})

])

.then(() => console.log("This Should Appear at the very end"))

