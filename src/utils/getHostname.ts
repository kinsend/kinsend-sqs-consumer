import { exec } from 'child_process';
import * as os from 'os';

export const getHostname = async () => {
  const command = 'cat /proc/1/cpuset';
  let hostname = '';
  try {
    hostname = await new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.log(`Error running command ${command}`, err);
          return reject(err);
        }
        if (stderr) {
          console.log(`stderr running command ${command}`, stderr);
          return reject(stderr);
        }
        if (stdout.trim().includes('docker'))
          return resolve(stdout.trim().split('/')[2]);
        return resolve('');
      });
    });
  } catch (error) {
    hostname = os.hostname();
  }
  // Additional step of error handling
  if (hostname === '') hostname = os.hostname();
  return hostname;
};
