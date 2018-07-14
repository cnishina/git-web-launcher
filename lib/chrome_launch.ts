import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as parseGitConfig from 'parse-git-config';
import { By, Capabilities } from 'selenium-webdriver';
import { Driver, ServiceBuilder } from 'selenium-webdriver/chrome';
import { ChromeDriver } from 'webdriver-manager-replacement';

import * as bitbucketUrl from './provider/bitbucket_url';
import * as githubUrl from './provider/github_url';
import * as gitlabUrl from './provider/gitlab_url';

export let outDir = path.resolve(__dirname, '..', 'downloads');
export let chromeDriverFile = path.resolve(outDir, 'chromedriver');
export let installationFile = path.resolve(outDir, 'installation.info')

/**
 * Asynchronous download for the ChromeDriver binary using webdriver-manager.
 * @returns A promise.
 */
export function setupChromeDriver(): Promise<void> {
  let chromeDriver = new ChromeDriver();
  chromeDriver.outDir = outDir;
  return chromeDriver.updateBinary().catch(err => {
    console.error(err);
  });
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
 * @param pathOption When the user provides a path to a file or folder.
 * @param currentPath The current path of the directory.
 * @param appendPath As we navigate to the parent, append child folders here.
 * @returns Either the url or null if there is no .git/config
 */
export function getGitConfigUrl(
    remoteName: string,
    remoteBranch: string,
    pathOption: string,
    currentPath: string,
    appendPath: string,
    gitFolder: string = '.git'): string|null {
  // If we have navigated to the windows main drive or the root directory,
  // return null.
  if ((os.type() === 'Windows_NT' && currentPath.endsWith(':\\')) ||
      currentPath === '/') {
    return null;
  }

  try {
    // Try to look up a .git/config and parse the file for the url
    let statSync = fs.statSync(path.resolve(currentPath, gitFolder));
    if (statSync.isDirectory()) {
      let gitConfig = parseGitConfig.sync(
        {path: path.resolve(currentPath, gitFolder, 'config')});
      let remote: string = gitConfig[`remote "${remoteName}"`]['url'];

      let remoteUrl = generateRemoteUrl(remote);
      if (remoteUrl.match('github')) {
        return githubUrl.srcUrl(
          remoteUrl, pathOption, currentPath, appendPath, remoteBranch);  
      } else if (remoteUrl.match('gitlab')) {
        return gitlabUrl.srcUrl(
          remoteUrl, pathOption, currentPath, appendPath, remoteBranch);  
      } else if (remoteUrl.match('bitbucket')) {
        return bitbucketUrl.srcUrl(
          remoteUrl, pathOption, currentPath, appendPath, remoteBranch);  
      } else {
        return null;
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
      pathOption,
      newPath,
      appendPath,
      gitFolder);
  }
}

export function generateRemoteUrl(remote: string): string {
  let url: string;
  if (remote.startsWith('https://')) {
    url = remote.replace('https://', ''); 
  } else if (remote.startsWith('ssh://git@')) {
    url = remote.replace('ssh://git@', '').replace(':', '/');
  } else if (remote.startsWith('git@')) {
    url = remote.replace('git@', '').replace(':', '/')
  } else if (remote.startsWith('git://')) {
    url = remote.replace('git://', '').replace(':', '/')
  }
  if (url.endsWith('.git')) {
    url = url.substring(0, url.length - 4);
  }
  url = 'https://' + url;
  return url;
}
