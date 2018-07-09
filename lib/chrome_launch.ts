import * as path from 'path';
import {By, Capabilities, until} from 'selenium-webdriver';
import {Driver, ServiceBuilder} from 'selenium-webdriver/chrome';
import {ChromeDriver} from 'webdriver-manager';

let outDir = path.resolve('driver');
let chromeDriverFile: string = path.resolve(outDir, 'chromedriver');

export async function setupChromeDriver() {
  let chromeDriver = new ChromeDriver();
  chromeDriver.outDir = outDir;
  await chromeDriver.updateBinary();
}

export async function findChromeInstallation() {
  let service = new ServiceBuilder(chromeDriverFile).build();
  const chromeCapabilities = Capabilities.chrome();
  // chromeCapabilities.set('chromeOptions', {args: ['--headless']});
  let driver = Driver.createSession(chromeCapabilities, service);
  await driver.get('chrome://version');
  // await driver.sleep(1000);
  let text = await driver.findElement(By.id('command_line')).getText();
  let chromeInstallation = text.split('--')[0].trim();
  await driver.quit();
  return chromeInstallation;
}

