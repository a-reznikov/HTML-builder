const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const EventEmitter = require('events');

const BORDER = '============================================';
const HI = 'Hi! Please enter your message in the console';
const BYE = '     Bye, bye! I hope to see you again.     ';

const emitter = new EventEmitter();
emitter.on('start', () =>  stdout.write(`${BORDER}\n${HI}\n${BORDER}\n`));
emitter.emit('start');

const output = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), 'utf-8');
stdin.on('data', data => {
  const dataString = data.toString().trim();
  if (dataString === 'exit') {
    exitApp();
  }
  output.write(data);
});

process.on('SIGINT', () => {
  exitApp();
});

function exitApp() {
  stdout.write(`${BORDER}\n${BYE}\n${BORDER}\n`);
  process.exit();
}
