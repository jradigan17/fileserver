const fs = require('fs');

const dirStructure = (direct) => {
  return new Promise((resolve, reject) => {
    fs.readdir(direct, (err, files) => {
      if (err) {
        reject(console.log(err));
      }
        resolve([direct, files]) 
    })
  })
}

const fileType = async ([path, files]) => {
  return Promise.allSettled (files.map(function(file) {
    return new Promise((resolve, reject) => {
      fs.stat(`${path}/${file}`, (error, stats) => {
        if (error) {
          reject(console.error('Error:', file));
        }
        resolve([`${path}/${file}`, stats.isDirectory(), `${path}`]) 
      })
    })
  }))
}

const printFile = (item) => {
  console.log(`\nFiles available in directory: ${item[0]["value"][2]}`)
  return Promise.allSettled (item.map(function(pizza) {
    return new Promise((resolve, reject) => {
      if (pizza["value"][1]) {
        resolve(dirStructure(pizza["value"][0]).then(fileType).then(printFile))
      } else {
        resolve(console.log(pizza["value"][0]))
      }
    })
  }))
}


dirStructure(".")
  .then(fileType)
    .then(printFile)
      .then(() => {console.log("This Should Appear at the very end")})

