import * as path from 'path';
import * as childProcess from 'child_process';
import {getGitConfigUrl, getChromeInstallation} from './chrome_launch';

// TODO(cnishina): add a verbose flag and use the logging method everywhere.

let argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command(
    '[file]',
    'Launches Chrome for the file name or folder path (default = ".") to the ' +
    'remote and branch. The remote name is optional (default = "origin"). ' +
    'The branch name is also optional (default = "master")')
  .command(
    '[file] [remote]',
    'Launches the file name or folder path to the remote name.')
  .command(
    '[file] [remote] [branch]',
    'Launches the file name or folder path to the remote name and branch.')
  .alias('b', 'blame')
  .describe('b', 'The blame or annotated view of the file.')
  .default('b', false)
  .argv;

export function launch() {
  let remote = 'origin';
  let branch = 'master';
  let url: string;
  let currentPath = path.resolve('.');
  let pathOption = '';


  // TODO(cnishina): save browser location if provided and write to file.
  if (argv._.length == 0) {

  }

  if (argv._.length >= 1) {
    pathOption = argv._[0];
  }
  if (argv._.length >= 2 ) {
    remote = argv._[1];
  }
  if (argv._.length >= 3) {
    branch = argv._[2];
  }
  return getChromeInstallation().then(chrome => {
    url = getGitConfigUrl(remote, branch, pathOption, currentPath, '', argv);

    // Fire and forget Chrome.
    console.log(url);
    childProcess.exec(chrome + ' ' + url);
  }).catch(err => {
    console.error(err);
  });
}
