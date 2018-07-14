import * as fs from 'fs';
import { appendGitHub, generateRemoteUrl } from './chrome_launch';

describe('chrome_launch', () => {
  describe('generateRemoteUrl', () => {
    it('should work for "https://"', () => {
      let remoteUrl = 'https://github.com/foo/bar';
      expect(generateRemoteUrl(remoteUrl)).toBe('https://github.com/foo/bar');

      remoteUrl = 'https://github.com/foo/bar.git';
      expect(generateRemoteUrl(remoteUrl)).toBe('https://github.com/foo/bar');
    });

    it('should work for "ssh://git@', () => {
      let remoteUrl = 'ssh://git@github.com:foo/bar';
      expect(generateRemoteUrl(remoteUrl)).toBe('https://github.com/foo/bar');
      
      remoteUrl = 'ssh://git@github.com:foo/bar.git';
      expect(generateRemoteUrl(remoteUrl)).toBe('https://github.com/foo/bar');
    });

    it('should work for "git@"', () => {
      let remoteUrl = 'git@github.com:foo/bar';
      expect(generateRemoteUrl(remoteUrl)).toBe('https://github.com/foo/bar');
      
      remoteUrl = 'git@github.com:foo/bar.git';
      expect(generateRemoteUrl(remoteUrl)).toBe('https://github.com/foo/bar');
    });

    it('should work for "git://"', () => {
      let remoteUrl = 'git://github.com:foo/bar';
      expect(generateRemoteUrl(remoteUrl)).toBe('https://github.com/foo/bar');
      
      remoteUrl = 'git://github.com:foo/bar.git';
      expect(generateRemoteUrl(remoteUrl)).toBe('https://github.com/foo/bar');
    });
  });

  describe('appendGitHub', () => {
    let remoteUrl = 'https://github.com/foo/bar';
    let remoteBranch = 'master';
    
    

    it('should work for full path files', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return false; }
      });
      let pathOption = '/path/to/file';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'another/path/to/';
      let url = appendGitHub(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://github.com/foo/bar/blob/master/path/to/file');
    });

    it('should work for relative path files', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return false; }
      });
      let pathOption = 'file';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'path/to/';
      let url = appendGitHub(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://github.com/foo/bar/blob/master/path/to/file');
    });

    it('should work for full path folders', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return true; }
      });
      let pathOption = '/path/to/';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'another/path/to/';
      let url = appendGitHub(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://github.com/foo/bar/tree/master/path/to');
    });

    it('should work for relative path folders', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return true; }
      });
      let pathOption = 'to/';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'path/';
      let url = appendGitHub(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://github.com/foo/bar/tree/master/path/to');
    });
  });
});