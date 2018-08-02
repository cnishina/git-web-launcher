import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as parseGitConfig from 'parse-git-config';
import * as bitbucketUrl from './provider/bitbucket_url';
import * as githubUrl from './provider/github_url';
import * as gitlabUrl from './provider/gitlab_url';

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
    flags: any,
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
        if (flags.blame || flags.b) {
          return githubUrl.blameUrl(
            remoteUrl, pathOption, currentPath, appendPath, remoteBranch);  
        } else {
          return githubUrl.srcUrl(
            remoteUrl, pathOption, currentPath, appendPath, remoteBranch);  
        }
      } else if (remoteUrl.match('gitlab')) {
        if (flags.blame || flags.b) {
          return gitlabUrl.blameUrl(
            remoteUrl, pathOption, currentPath, appendPath, remoteBranch);  
        } else {
          return gitlabUrl.srcUrl(
            remoteUrl, pathOption, currentPath, appendPath, remoteBranch);  
        }
      } else if (remoteUrl.match('bitbucket')) {
        if (flags.blame || flags.b) {
          return bitbucketUrl.blameUrl(
            remoteUrl, pathOption, currentPath, appendPath, remoteBranch);  
        } else {
          return bitbucketUrl.srcUrl(
            remoteUrl, pathOption, currentPath, appendPath, remoteBranch);  
        }
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
      flags,
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
