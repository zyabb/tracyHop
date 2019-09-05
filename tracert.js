const { spawn } = require('child_process');
const chalk = require('chalk');

const argument = process.argv[2];

const parseHop = require('./parsers');

const child = spawn('tracert', ['-d', argument], {
  // detached: true,
  shell: true,
});

child.stdout.on('data', async data => {
  const { hop, ip, rtt1 } = parseHop(data) || '';
  if (hop !== undefined && ip !== undefined && rtt1 !== undefined) {
    console.log('hop: ' + hop + ' ip: ' + ip + ' rtt1: ' + rtt1);
  }
});

child.stderr.on('data', data => {
  console.log(chalk.red(data.toString()));
});

child.on('exit', function(code, signal) {
  if (code === 0 && signal === null) {
    console.log(chalk.bold.green('\nCompleted without errors'));
  } else {
    console.log(
      'child process exited with ' + `code ${code} and signal ${signal}`
    );
  }
});
