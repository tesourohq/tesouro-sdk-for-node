import { hello } from '../../src/index';

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

  describe('module exports', () => {
    it('should export hello function', () => {
      expect(hello).toBeDefined();
      expect(typeof hello).toBe('function');
    });
  });
});
