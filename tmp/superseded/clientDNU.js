//----------------------------------------------------------
// Required aspects/files
const {conColor, conLine} = require('../../../formatting/globalvar');
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
const dirStructure = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        return reject(console.log(err));
      } else {
        files.forEach(file => {
          if (!file.includes('.')) {
            return resolve(dirStructure(`${path}/${file}`));
          } else {
            console.log(`${conColor.cyan}${path}/${file}${conColor.reset}`);
          }
        });
        return resolve();
      }
    });
  });
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
  console.log(`\n${conColor.cyan}The following are files available on the server${conColor.reset}`);
  dirStructure('.')
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





