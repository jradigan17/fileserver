//----------------------------------------------------------
// Required aspects/files
const fs = require('fs');
const {conColor, conLine} = require('../../formatting/globalvar');
const net = require("net");
//----------------------------------------------------------

//----------------------------------------------------------
const server = net.createServer();
console.clear();
//----------------------------------------------------------

//----------------------------------------------------------
// On client connection
server.on("connection", (client) => {
  client.setEncoding("utf8"); // interpret data as text

  // Accept data from client side and print on server side
  client.on("data", (data) => {
    console.log("Message from client: ", data);
    fileExists(data, client);
  });
});
//----------------------------------------------------------

//----------------------------------------------------------
// Listen for client
server.listen(1052, () => {
  console.log("Server listening on port 1052!");
});
//----------------------------------------------------------

//----------------------------------------------------------
// Does File Exist
const fileExists = (file, client) => {
  fs.access(`${file}`, (err) => {
    if (err) {
      client.write(`${conColor.red}ERROR: FILE NOT FOUND${conColor.reset}`);
      client.write(`\n${conLine.fullLineDash(conColor.orange)}`);
      process.exit();
    } else {
      client.write(`FILE FOUND`);
      fetch(`${file}`, client);
    }
  });
};
//----------------------------------------------------------

//----------------------------------------------------------
// Fetch function
// fs.writeFile( file, data, options, callback )
const fetch = (file, client) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      client.write(`${conColor.red}ERROR: FILE NOT FOUND${conColor.reset}`);
      client.write(`\n${conLine.fullLineDash(conColor.orange)}`);
    } else {
      fs.stat(file, (err, stats) => {
        if (err) {
          client.write(`${conColor.red}ERROR: FILE NOT FOUND${conColor.reset}`);
          client.write(`\n${conLine.fullLineDash(conColor.orange)}`);
          process.exit();
        } else {
          // console.log(stats);
          client.write(`\n${conLine.centeredFullLine(`Contents of ${file}`, conColor.magenta)}`);
          client.write(`\n${conColor.yellow}${data}${conColor.reset}`);
          client.write(`\n${conLine.centeredFullLine(`[Wrote ${stats.size} bytes]`, conColor.magenta)}`);
          client.write(`\n${conLine.fullLineDash(conColor.orange)}`);
          process.exit();
        }
      });
    }
  });
};
//----------------------------------------------------------