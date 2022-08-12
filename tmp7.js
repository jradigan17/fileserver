const fs = require('fs');
const {conColor, conLine} = require('../../formatting/globalvar');

const fetch = (file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.log(`${conColor.red}ERROR: FILE NOT FOUND${conColor.reset}`);
      console.log(`\n${conLine.fullLineDash(conColor.orange)}`);
    } else {
      fs.stat(file, (err, stats) => {
        if (err) {
          console.log(`${conColor.red}ERROR: FILE NOT FOUND${conColor.reset}`);
          console.log(`\n${conLine.fullLineDash(conColor.orange)}`);
          process.exit();
        } else {
          // console.log(stats);
          console.log(`\n${conLine.centeredFullLine(`Contents of ${file}`, conColor.magenta)}`);
          console.log(`\n${conColor.yellow}${data}${conColor.reset}`);
          console.log(`\n${conLine.centeredFullLine(`[Wrote ${stats.size} bytes]`, conColor.magenta)}`);
          console.log(`\n${conLine.fullLineDash(conColor.orange)}`);
          process.exit();
        }
      });
    }
  });
};

const dirStructure = (direct) => {
  return new Promise((resolve, reject) => {
    fs.readdir(direct, (err, files) => {
      if (err) {
        reject(console.log(err));
      }
      resolve([direct, files]);
    });
  });
};

const fileType = ([path, files]) => {
  return Promise.allSettled(files.map(function(file) {
    return new Promise((resolve, reject) => {
      fs.stat(`${path}/${file}`, (error, stats) => {
        if (error) {
          reject(console.error('Error:', file));
        }
        resolve([`${path}/${file}`, stats.isDirectory(), `${path}`, `${file}`]);
      });
    });
  }));
};

const printFile = (item) => {
  console.log(`${conColor.blue}\nFiles available in directory: ${item[0]["value"][2]}${conColor.reset}`);
  return Promise.allSettled(item.map(function(pizza) {
    return new Promise((resolve, reject) => {
      if (pizza["value"][3] === ".git") {
        resolve()
      } else if(pizza["value"][1]) {
        resolve(dirStructure(pizza["value"][0]).then(fileType).then(printFile));
      } else {
        resolve(console.log(`${conColor.cyan}${pizza["value"][0]}${conColor.reset}`));
      }
    });
  }));
};


dirStructure(".")
  .then(fileType)
  .then(printFile)
  .then(() => {
    console.log("This Should Appear at the very end");
  });

