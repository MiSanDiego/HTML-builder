const path = require('node:path');
const fs = require('node:fs/promises');

const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt('Hello ,please input several words below:\n');
rl.prompt();

fs.writeFile(path.join(__dirname, 'output.txt'), '', err => {
  if (err) {
    console.error(err);
  } else {
    console.error('write file successfully');
  }
});

rl.on('line', (input) => {
  if (input === "exit") {
    rl.close();
  } else {
    fs.appendFile(path.join(__dirname, "output.txt"), input+'\n');
  }
}).on('close',function(){
  rl.close();
  console.log('Thank you and good bye!');
});