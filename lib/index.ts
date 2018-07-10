import * as path from 'path';
import * as childProcess from 'child_process';
import {findGitConfig, setupChromeDriver, findChromeInstallation, getChromeInstallation} from './chrome_launch';

export async function launch() {
  let contents = findGitConfig(path.resolve('.'), 'origin', 'master', '');
  console.log(contents);

  let installation = getChromeInstallation();
  if (!installation) {
    await setupChromeDriver();
    installation = await findChromeInstallation();
  }
  // fire and forget Chrome.
  childProcess.spawn(installation, [contents]);
}
