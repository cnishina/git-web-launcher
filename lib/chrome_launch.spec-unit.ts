import * as fs from 'fs';
import { generateRemoteUrl } from './chrome_launch';

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
});