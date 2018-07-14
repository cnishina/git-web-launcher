import * as fs from 'fs';
import { blameUrl, srcUrl } from './github_url';

describe('github_url', () => {
  describe('srcUrl', () => {
    let remoteUrl = 'https://gitlab.com/foo/bar';
    let remoteBranch = 'master';
  
    it('should work for full path files', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return false; }
      });
      let pathOption = '/path/to/file';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'another/path/to/';
      let url = srcUrl(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://gitlab.com/foo/bar/blob/master/path/to/file');
    });
  
    it('should work for relative path files', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return false; }
      });
      let pathOption = 'file';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'path/to/';
      let url = srcUrl(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://gitlab.com/foo/bar/blob/master/path/to/file');
    });
  
    it('should work for full path folders', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return true; }
      });
      let pathOption = '/path/to/';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'another/path/to/';
      let url = srcUrl(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://gitlab.com/foo/bar/tree/master/path/to');
    });
  
    it('should work for relative path folders', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return true; }
      });
      let pathOption = 'to/';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'path/';
      let url = srcUrl(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://gitlab.com/foo/bar/tree/master/path/to');
    });
  });

  describe('blameUrl', () => {
    let remoteUrl = 'https://gitlab.com/foo/bar';
    let remoteBranch = 'master';
  
    it('should work for full path files', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return false; }
      });
      let pathOption = '/path/to/file';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'another/path/to/';
      let url = blameUrl(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://gitlab.com/foo/bar/blame/master/path/to/file');
    });
  
    it('should work for relative path files', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return false; }
      });
      let pathOption = 'file';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'path/to/';
      let url = blameUrl(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://gitlab.com/foo/bar/blame/master/path/to/file');
    });
  
    it('should work for full path folders', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return true; }
      });
      let pathOption = '/path/to/';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'another/path/to/';
      let url = blameUrl(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://gitlab.com/foo/bar/tree/master/path/to');
    });
  
    it('should work for relative path folders', () => {
      spyOn(fs, 'statSync').and.returnValue({
        isDirectory: function() { return true; }
      });
      let pathOption = 'to/';
      let currentPath = '/some/path/to/foo/bar';
      let appendPath = 'path/';
      let url = blameUrl(remoteUrl, pathOption, currentPath, appendPath,
        remoteBranch);
      expect(url).toBe('https://gitlab.com/foo/bar/tree/master/path/to');
    });
  });
});
