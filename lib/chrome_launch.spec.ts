import * as childProcess from 'child_process';
import {setupChromeDriver, findChromeInstallation, getChromeInstallation} from './chrome_launch';

describe('', () => {
  it('', async() => {
    let installation = getChromeInstallation();
    if (!installation) {
      await setupChromeDriver();
      installation = await findChromeInstallation();
    }
    childProcess.spawn(installation, ['http://github.com/cnishina/webderpy-launcher']);
  })
});