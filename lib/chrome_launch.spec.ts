import * as childProcess from 'child_process';
import {setupChromeDriver, findChromeInstallation} from './chrome_launch';

describe('', () => {
  it('', async() => {
    await setupChromeDriver();
    let install = await findChromeInstallation();
    childProcess.spawn(install, ['http://github.com/cnishina/webderpy-launcher']);
  })
});