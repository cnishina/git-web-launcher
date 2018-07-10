import * as childProcess from 'child_process';
import { getChromeInstallation } from './chrome_launch';

describe('', () => {
  it('', async() => {
    let installation = await getChromeInstallation();
    childProcess.spawn(installation, ['http://github.com/cnishina/webderpy-launcher']);
  })
});