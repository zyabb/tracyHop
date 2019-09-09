const { spawn } = require('child_process');
const chalk = require('chalk');
const https = require('https');
const argument = process.argv[2];

const parseHop = require('./parsers');

const child = spawn('traceroute', ['-q', 1, '-z', 0, '-n', argument], {
  detached: true,
});

child.on('error', function(err) {
  console.log('This is win32 system. Run tracert ', argument);
});

const reqCountry = ip => {
  return new Promise((resolve, reject) => {
    https
      .get(`https://freegeoip.app/json/${ip}`, resp => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          const obj = JSON.parse(data).country_name;
          resolve(obj);
        });
      })
      .on('error', err => {
        console.log('Error: ' + err.message);
        reject(err);
      });
  });
};

child.stdout.on('data', async data => {
  const { hop, ip, rtt1 } = parseHop(data) || '';
  if (ip !== '*' && ip !== undefined) {
    await reqCountry(ip).then(data => {
      if (
        hop !== undefined &&
        ip !== undefined &&
        rtt1 !== undefined &&
        data.length !== 0
      ) {
        console.log(
          'hop: ' +
            hop +
            ' ip: ' +
            ip +
            ' rtt1: ' +
            rtt1 +
            ' country ' +
            chalk.blue(data)
        );
      }
    });
  } else {
    console.log('hop: ' + hop + ' ip: ' + ip + ' rtt1: ' + rtt1 + ' uknown ip');
  }
});

child.stderr.on('data', data => {
  console.log(chalk.red(data.toString()));
});

child.on('exit', function(code, signal) {
  if (code === 0 && signal === null) {
    setTimeout(() => {
      console.log(chalk.bold.green('\nCompleted without errors'));
    }, 3000);
  } else {
    console.log(
      'child process exited with ' + `code ${code} and signal ${signal}`
    );
  }
});
