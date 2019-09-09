var { spawn } = require('child_process');
var readline = require('readline');

const argument = process.argv[2];

const { parseWinHop } = require('./parsers');

const child = spawn('tracert', ['-d', argument], {
  // detached: true,
  // shell: true,
});

child.on('error', function(err) {
  console.log('This is not win32 system. Run traceroute ', argument);
  console.err(err);
});

const rl = require('readline').createInterface({ input: child.stdout });

rl.on('line', function(line) {
  const { hop, rtt1, rtt2, rtt3, ip } = parseWinHop(line) || '';
  console.log(hop, rtt1, rtt2, rtt3, ip);
});
