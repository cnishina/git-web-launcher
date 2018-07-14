import * as fs from 'fs';
import * as path from 'path';

export function srcUrl(
    remoteUrl: string,
    pathOption: string,
    currentPath: string,
    appendPath: string,
    remoteBranch: string): string {
  let url: string;
  // get the path of the file or folder
  if (pathOption.startsWith('/')) {
    appendPath = pathOption.substring(1);
  } else {
    appendPath += pathOption;
  }
  appendPath = path.resolve(currentPath, appendPath)
    .replace(currentPath, '').substring(1);
  url = remoteUrl + '/src/' + remoteBranch + '/' + appendPath;
  return url;
}

export function blameUrl(
  remoteUrl: string,
  pathOption: string,
  currentPath: string,
  appendPath: string,
  remoteBranch: string): string {
    let url: string;
  // get the path of the file or folder
  if (pathOption.startsWith('/')) {
    appendPath = pathOption.substring(1);
  } else {
    appendPath += pathOption;
  }
  appendPath = path.resolve(currentPath, appendPath)
    .replace(currentPath, '').substring(1);

  if (fs.statSync(path.resolve(currentPath, appendPath)).isDirectory()) {
    url = remoteUrl + '/src/' + remoteBranch + '/' + appendPath;
  } else {
    url = remoteUrl + '/annotate/' + remoteBranch + '/' + appendPath;
  }
  return url;
}