import * as path from 'path';
import * as childProcess from 'child_process';
import {getGitConfigUrl, getChromeInstallation} from './chrome_launch';

/**
 * Launch main method.
 */
export async function launch() {
  let installation = await getChromeInstallation();
  let contents = getGitConfigUrl(
    'origin',
    'master',
    path.resolve('.'), '');
  
  // Fire and forget Chrome.
  childProcess.spawn(installation, [contents]);
}
