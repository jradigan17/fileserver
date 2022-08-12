const fs = require('fs');
const {conColor, conLine} = require('../../formatting/globalvar');

let itemCount = 0;

const fetch = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        resolve(['.', []]);
      } else {
        fs.stat(file, (err, stats) => {
          if (err) {
            resolve(['.', []]);
          } else {
            if (stats.size > 0) {
              resolve(['.', data.slice(1).toString().split("\r\n*")]);
            }
            resolve(['.', []]);
          }
        });
      }
    });
  });
};

const dirStructure = ([direct, gitignore]) => {
  return new Promise((resolve, reject) => {
    fs.readdir(direct, (err, files) => {
      if (err) {
        reject(console.log(err));
      }
      resolve([direct, files, gitignore]);
    });
  });
};

const fileType = ([path, files, gitignore]) => {
  return Promise.allSettled(files.map(function(file) {
    return new Promise((resolve, reject) => {
      fs.stat(`${path}/${file}`, (error, stats) => {
        if (error) {
          reject(console.error('Error:', file));
        }
        resolve([`${path}/${file}`, stats.isDirectory(), `${path}`, `${file}`, gitignore]);
      });
    });
  }));
};

const printFile = (item) => {
  console.log(`${conColor.blue}\nFiles available in directory: ${item[0]["value"][2]}${conColor.reset}`);
  return Promise.allSettled(item.map(function(pizza) {
    itemCount += 1;
    return new Promise((resolve, reject) => {
      const result = item[0]["value"][4].filter(git => pizza["value"][3].includes(git));
      if (pizza["value"][3] === ".git") {
        resolve();
      } else if (result.length > 0) {
        resolve();
      } else if (pizza["value"][1]) {
        resolve(dirStructure([pizza["value"][0], item[0]["value"][4]]).then(fileType).then(printFile));
      } else {
        resolve(console.log(`${conColor.cyan}${pizza["value"][0]}${conColor.reset}`));
      }
    });
  }));
};


fetch('./.gitignore')
  .then(dirStructure)
  .then(fileType)
  .then(printFile)
  .then(() => {
    console.log(`${conColor.red}Total Number of Files Read: ${itemCount}${conColor.reset}`);
  });

