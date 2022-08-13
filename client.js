//----------------------------------------------------------
// README - you must make sure that server & client are in the same location
//----------------------------------------------------------

//----------------------------------------------------------
// Required aspects/files
const {conColor, conLine} = require('../../formatting/globalvar');
const net = require("net");
const readline = require('readline');
const fs = require('fs');
//----------------------------------------------------------

//----------------------------------------------------------
console.clear();
console.log(`${conLine.fullLineDash(conColor.orange)}`);
//----------------------------------------------------------

//----------------------------------------------------------
// Create Interface
const conn = net.createConnection({
  host: 'localhost', //"SERVER IP ADDRESS HERE", // change to IP address of computer
  port: 1052,
});

conn.setEncoding("utf8"); // interpret data as text
//----------------------------------------------------------

//----------------------------------------------------------
// Show Available Files - Account for .gitignore file
let itemCount = 0;

// Fetch .gitignore file & read file types to ignore
// If no file or empty - send empty array
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
              resolve(['.', data.toString().split("\r\n").map(each => each.trim().replace(/\*/, '')).filter(word => word.length > 0 && word[0] !== "#")]);
            }
            resolve(['.', []]);
          }
        });
      }
    });
  });
};

// Read directory
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

// Read file type
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

// Print all files which are not .git, not part of .gitignore, and not a directory
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
//----------------------------------------------------------

//----------------------------------------------------------
// On data from Server
conn.on("data", (data) => {
  console.log(`${conColor.cyan}${data}${conColor.reset}`);
});
//----------------------------------------------------------

//----------------------------------------------------------
// Client on Server Conneciton
conn.on("connect", () => {
  console.log(`${conLine.centeredFullLine("Welcome to File Server", conColor.cyan)}`);
  console.log(`\n${conColor.cyan}The following are files available${conColor.reset}`);
  fetch('.gitignore')
    .then(dirStructure)
    .then(fileType)
    .then(printFile)
    .then(() => {
      return new Promise((resolve, reject) => {
        resolve(console.log(`${conColor.red}Total Number of Files Read: ${itemCount}${conColor.reset}`));
      })
    })
    .then(file);
});
//----------------------------------------------------------

//----------------------------------------------------------
// Client on Failed Server Connection
conn.on('error', (errorCode) => {
  console.log(`${conColor.red}  SERVER START ERROR: ${errorCode}${conColor.reset}`);
  console.log(`${conColor.cyan}     (did you forget to start the game server, perhaps?)${conColor.reset}`);
  console.log(`${conLine.fullLineDash(conColor.orange)}`);
  process.exit();
});
//----------------------------------------------------------

//----------------------------------------------------------
// Readline for File
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const file = () => {
  rl.question(`${conColor.green}What file would you like the Server to Return? ${conColor.red}`, (answer) => {
    conn.write(answer);
    console.log(`${conColor.cyan}Searching ...${conColor.reset}`);
    rl.close();
  });
};
//----------------------------------------------------------





