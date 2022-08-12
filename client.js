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
// Show Available Files - Currently will only do two levels - parent & 1 child
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
  dirStructure(".")
    .then(fileType)
    .then(printFile)
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





