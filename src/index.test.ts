import { hello, version } from './index';

describe('Tesouro SDK', () => {
  describe('hello function', () => {
    it('should return a greeting message', () => {
      const result = hello();
      expect(result).toBe('Hello from Tesouro SDK!');
    });

    it('should return a string', () => {
      const result = hello();
      expect(typeof result).toBe('string');
    });
  });

  describe('version export', () => {
    it('should export the correct version', () => {
      expect(version).toBe('0.0.1');
    });

    it('should be a string', () => {
      expect(typeof version).toBe('string');
    });

    it('should follow semantic versioning pattern', () => {
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('module exports', () => {
    it('should export hello function', () => {
      expect(hello).toBeDefined();
      expect(typeof hello).toBe('function');
    });

    it('should export version string', () => {
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
    });
  });
});
