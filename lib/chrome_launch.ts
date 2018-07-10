import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as parseGitConfig from 'parse-git-config';
import { By, Capabilities } from 'selenium-webdriver';
import { Driver, ServiceBuilder } from 'selenium-webdriver/chrome';
import { ChromeDriver } from 'webdriver-manager-replacement';

let outDir = path.resolve(__dirname, '..', 'downloads');
let chromeDriverFile = path.resolve(outDir, 'chromedriver');
let installationFile = path.resolve(outDir, 'installation.info')

/**
 * Asynchronous download for the ChromeDriver binary using webdriver-manager.
 * @returns A promise.
 */
export async function setupChromeDriver(): Promise<void> {
  let chromeDriver = new ChromeDriver();
  chromeDriver.outDir = outDir;
  await chromeDriver.updateBinary();
}

/**
 * Get the Chrome installation. This is accomplished by trying to read the
 * installation file. If the file is unavailable, launch Chrome with
 * ChromeDriver via the selenium-webdriver lib. Navigating to
 * 'chrome://version' and get the text for the command line. Parse out the
 * installation and write it to the installation file so it can be available
 * for future lookups.
 * @returns The Chrome installation that can be executed via command line. 
 */
export async function getChromeInstallation(): Promise<string> {
  try {
    return fs.readFileSync(installationFile).toString();
  } catch(err) {
    // Get the ChromeDriver binaries
    await setupChromeDriver();

    // Launch Chrome directly with ChromeDriver. After testing headless does
    // not work when navigating to chrome://version.
    let service = new ServiceBuilder(chromeDriverFile).build();
    const chromeCapabilities = Capabilities.chrome();
    let driver = Driver.createSession(chromeCapabilities, service);
    await driver.get('chrome://version');

    // Parse out the command line for Chrome, write it to file,
    // and return the value.
    let text = await driver.findElement(By.id('command_line')).getText();
    let chromeInstallation = text.split('--')[0].trim();
    await driver.quit();
    fs.writeFileSync(installationFile, chromeInstallation);
    return chromeInstallation;
  }
}

/**
 * Get the git config url.
 * @param remoteName The remote name (e.g. 'origin')
 * @param remoteBranch The branch we want to look at (e.g. 'master')
 * @param currentPath The current path of the directory.
 * @param appendPath As we navigate to the parent, append child folders here.
 * @returns Either the url or null if there is no .git/config
 */
export function getGitConfigUrl(
    remoteName: string,
    remoteBranch: string,
    currentPath: string,
    appendPath: string): string|null {
  // If we have navigated to the windows main drive or the root directory,
  // return null.
  if ((os.type() === 'Windows_NT' && currentPath.endsWith(':\\')) ||
      currentPath === '/') {
    return null;
  }

  try {
    // Try to look up a .git/config and parse the file for the url
    let statSync = fs.statSync(path.resolve(currentPath, '.git'));
    if (statSync.isDirectory()) {
      let gitConfig = parseGitConfig.sync(
        {path: path.resolve(currentPath, '.git', 'config')});
      let remote: string = gitConfig[`remote "${remoteName}"`]['url'];
      if (remote.startsWith('http')) {
        return remote;
      } else {
        return remote.replace(':', '/').replace('git@', 'https://') +
          '/tree/' + remoteBranch + '/' + appendPath;
      }
    } else {
      // if the .git is not a folder, then return null.
      return null;
    }
  } catch (err) {
    // Update both the current and appended path.
    let newPath = path.resolve(currentPath, '..');
    appendPath = currentPath.replace(newPath, '')
      .replace(path.sep, '') + '/' + appendPath;

    // Recursively call this method.
    return getGitConfigUrl(
      remoteName,
      remoteBranch,
      path.resolve(currentPath, '..'),
      appendPath);
  }
}