const fs = require('fs');
const promises = [];

async function dirStructure (path) {
  return new Promise((resolve, reject) => {
  fs.readdir(path, (err, files) => {
    if (err) {
    reject(console.log(err));
    } else {
      // for (let i = 0; p = Promise.resolve(); i < files.length; i++) {
        promises.push( new Promise((resolve, reject) => {
        files.forEach(file => {
        // p = p.then (() => 
          fs.stat(`${path}/${file}`, (error, stats) => {
         // incase of error
          if (error) {
            reject(console.error('Error:', file));
            return;
          }
          // check if path is a directory
          if (stats.isDirectory()) {
            // console.log('path = ', path, 'file =', file)
            (dirStructure(`${path}/${file}`));
          } else {
            // console.log(`\n${path} directory filenames:`);
            return resolve(console.log(`${path}/${file}`));
          }
        })
      })
      
    }))

        // if(!file.includes(".")) {
          // direct(file, path);
        // } else {
        // console.log(direct(file))
        // if(direct(file)) {
          // return dirStructure(file);
        
          // console.log(file);
        // }
      // }))

  }

})
  })
}



// const direct = (file, path) => {
//   fs.stat(`${path}/${file}`, (error, stats) => {
//     // incase of error
//     if (error) {
//       console.error('Error:', file);
//       return;
//     }
//     // check if path is a directory
//     if (stats.isDirectory()) {
//       // console.log('path = ', path, 'file =', file)
//       return dirStructure(`${path}/${file}`);
//     } else {
//       // console.log(`\n${path} directory filenames:`);
//       return console.log(`${path}/${file}`);
//     }
//   });
// }


dirStructure('.')
.then(() => console.log("This Should Appear at the very end"));

