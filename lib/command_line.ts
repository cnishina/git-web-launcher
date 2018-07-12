let argv = require('yargs').argv;
import * as path from 'path';
import * as childProcess from 'child_process';
import {getGitConfigUrl, getChromeInstallation} from './chrome_launch';

// TODO(cnishina): add a verbose flag and use the logging method everywhere.

export async function launch() {
  let remote = 'origin';
  let branch = 'master';
  let chrome: string = '';
  let url: string;
  let currentPath = path.resolve('.');
  let pathOption = '';

  if (argv._.length >= 1) {
    pathOption = argv._[0];
  }
  if (argv._.length >= 2 ) {
    remote = argv._[1];
  }
  if (argv._.length >= 3) {
    branch = argv._[2];
  }
  chrome = await getChromeInstallation();
    url = getGitConfigUrl(remote, branch, pathOption, currentPath, '');

  // Fire and forget Chrome.
  console.log(url);
  childProcess.spawn(chrome, [url]);
}
