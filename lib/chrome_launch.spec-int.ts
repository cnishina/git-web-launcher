import * as path from 'path';
import { getGitConfigUrl } from './chrome_launch';

const gitFolder = 'git'

describe('chrome_launch', () => {
  describe('getGitConfigUrl - git/config', () => {
    let remoteBranch = 'master';
    let currentPath = path.resolve('spec/support/files');
    let pathOption = '.';

    it('should work for "https://"', () => {
      let remoteName = 'https';
      let appendPath = '';
      let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
        currentPath, appendPath, {blame: false}, gitFolder);
      expect(gitUrl).toEqual('https://github.com/foo/bar/tree/master/');
    });

    it('should work for "https://" and ".git"', () => {
      let remoteName = 'https-git';
      let appendPath = '';
      let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
        currentPath, appendPath, {blame: false}, gitFolder);
      expect(gitUrl).toEqual('https://github.com/foo/bar/tree/master/');
    });

    it('should work for "ssh://git@"', () => {
      let remoteName = 'ssh';
      let appendPath = '';
      let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
        currentPath, appendPath, {blame: false}, gitFolder);
      expect(gitUrl).toEqual('https://github.com/foo/bar/tree/master/');
    });

    it('should work for "ssh://git@" and ".git"', () => {
      let remoteName = 'ssh-git';
      let appendPath = '';
      let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
        currentPath, appendPath, {blame: false}, gitFolder);
      expect(gitUrl).toEqual('https://github.com/foo/bar/tree/master/');
    });

    it('should work for "git@"', () => {
      let remoteName = 'git-at';
      let appendPath = '';
      let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
        currentPath, appendPath, {blame: false}, gitFolder);
      expect(gitUrl).toEqual('https://github.com/foo/bar/tree/master/');
    });

    it('should work for "git@" and ".git"', () => {
      let remoteName = 'git-at-git';
      let appendPath = '';
      let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
        currentPath, appendPath, {blame: false}, gitFolder);
      expect(gitUrl).toEqual('https://github.com/foo/bar/tree/master/');
    });

    it('should work for "git://"', () => {
      let remoteName = 'git-protocol';
      let appendPath = '';
      let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
        currentPath, appendPath, {blame: false}, gitFolder);
      expect(gitUrl).toEqual('https://github.com/foo/bar/tree/master/');
    });

    it('should work for "git://" and ".git"', () => {
      let remoteName = 'git-protocol-git';
      let appendPath = '';
      let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
        currentPath, appendPath, {blame: false}, gitFolder);
      expect(gitUrl).toEqual('https://github.com/foo/bar/tree/master/');
    });
  });

  describe('getGitConfigUrl - navigating', () => {
    describe('default', () => {
      let remoteName = 'origin';
      let remoteBranch = 'master';
      let currentPath = path.resolve('spec/support/files');
      
      it('should find the path when provided "."', () => {
        let pathOption = '.';
        let appendPath = '';  
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual('https://github.com/foo/bar/tree/master/');
      });

      it('should find the path when provided ""', () => {
        let pathOption = '';
        let appendPath = '';  
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual('https://github.com/foo/bar/tree/master/');
      });
    });

    describe('relative folder', () => {
      let remoteName = 'origin';
      let remoteBranch = 'master';

      it('should find the the relative "path/to" from "/"', () => {
        let pathOption = 'path/to/';
        let currentPath = path.resolve('spec/support/files');
        let appendPath = '';
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual(
          'https://github.com/foo/bar/tree/master/path/to');
      });

      it('should find the relative "to/" from "/path"', () => {
        let pathOption = 'to/';
        let currentPath = path.resolve('spec/support/files/path');
        let appendPath = '';
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual(
          'https://github.com/foo/bar/tree/master/path/to');
      });

      it('should find the relative "../../another/path/to" from "/path/to"',
          () => {
        let pathOption = '../../another/path/to';
        let currentPath = path.resolve('spec/support/files/path/to');
        let appendPath = '';
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual(
          'https://github.com/foo/bar/tree/master/another/path/to');
      });
    });

    describe('base folder from "/"', () => {
      let remoteName = 'origin';
      let remoteBranch = 'master';

      it('should find the "/path/to/" from "/"', () => {
        let pathOption = '/path/to/';
        let currentPath = path.resolve('spec/support/files');
        let appendPath = '';
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual(
          'https://github.com/foo/bar/tree/master/path/to');
      });

      it('should find the "/path/to/" from "/another/path/to/"', () => {
        let pathOption = '/path/to/';
        let currentPath = path.resolve('spec/support/files/another/path/to/');
        let appendPath = '';
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual(
          'https://github.com/foo/bar/tree/master/path/to');
      });
    });

    describe('relative file', () => {
      let remoteName = 'origin';
      let remoteBranch = 'master';

      it('should find relative "path/to/file" from "/"', () => {
        let pathOption = 'path/to/file';
        let currentPath = path.resolve('spec/support/files/');
        let appendPath = '';
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual('https://github.com/foo/bar/blob/master/path/to/file');
      });

      it('should find relative "to/file" from "/path/"', () => {
        let pathOption = 'to/file';
        let currentPath = path.resolve('spec/support/files/path');
        let appendPath = '';
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual(
          'https://github.com/foo/bar/blob/master/path/to/file');
      });

      it('should find the relative "../../another/path/to/file" from "/path/to"',
          () => {
        let pathOption = '../../another/path/to/file';
        let currentPath = path.resolve('spec/support/files/path/to');
        let appendPath = '';
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual(
          'https://github.com/foo/bar/blob/master/another/path/to/file');
      });
    });

    describe('base file from "/"', () => {
      let remoteName = 'origin';
      let remoteBranch = 'master';

      it('should find the folder path when provided a "/path/to/file"', () => {  
        let pathOption = '/path/to/file';
        let currentPath = path.resolve('spec/support/files');
        let appendPath = '';
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual(
          'https://github.com/foo/bar/blob/master/path/to/file');
      });

      it('should find the "/path/to/" from "/another/path/to/"', () => {
        let pathOption = '/path/to/file';
        let currentPath = path.resolve('spec/support/files/another/path/to/');
        let appendPath = '';
        let gitUrl = getGitConfigUrl(remoteName, remoteBranch, pathOption,
          currentPath, appendPath, {blame: false}, gitFolder);
        expect(gitUrl).toEqual(
          'https://github.com/foo/bar/blob/master/path/to/file');
      });
    });
  });
});