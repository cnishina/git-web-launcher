import * as fs from 'fs';
import * as path from 'path';
import * as parseGitConfig from 'parse-git-config';
import { By, Capabilities } from 'selenium-webdriver';
import { Driver, ServiceBuilder } from 'selenium-webdriver/chrome';
import { ChromeDriver } from 'webdriver-manager';

let outDir = path.resolve(__dirname, '..', 'downloads');
let chromeDriverFile = path.resolve(outDir, 'chromedriver');
let installationFile = path.resolve(outDir, 'installation.info')

export async function setupChromeDriver(): Promise<void> {
  let chromeDriver = new ChromeDriver();
  chromeDriver.outDir = outDir;
  await chromeDriver.updateBinary();
}

export async function findChromeInstallation(): Promise<string> {
  let service = new ServiceBuilder(chromeDriverFile).build();
  const chromeCapabilities = Capabilities.chrome();
  let driver = Driver.createSession(chromeCapabilities, service);
  await driver.get('chrome://version');
  let text = await driver.findElement(By.id('command_line')).getText();
  let chromeInstallation = text.split('--')[0].trim();
  await driver.quit();
  fs.writeFileSync(installationFile, chromeInstallation);
  return chromeInstallation;
}

export function getChromeInstallation(): string|null {
  try {
    return fs.readFileSync(installationFile).toString();
  } catch(err) {
    return null;
  }
}

export function findGitConfig(currentPath: string, remoteName: string, remoteBranch: string, appendPath: string): string|null {
  if (currentPath === '/') {
    return null;
  }
  try {
    let statSync = fs.statSync(path.resolve(currentPath, '.git'));
    if (statSync.isDirectory()) {
      let gitConfig = parseGitConfig.sync({path: path.resolve(currentPath, '.git', 'config')});
      let remote: string = gitConfig[`remote "${remoteName}"`]['url'];
      if (remote.startsWith('http')) {
        return remote;
      } else {
        return remote.replace(':', '/').replace('git@', 'https://') + '/tree/' + remoteBranch + '/' + appendPath;
      }

    } else {
      return null;
    }
  } catch (err) {
    let newPath = path.resolve(currentPath, '..');
    appendPath = currentPath.replace(newPath, '').replace(path.sep, '') + path.sep + appendPath;
    return findGitConfig(path.resolve(currentPath, '..'), remoteName, remoteBranch, appendPath);
  }
}