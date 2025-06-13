import * as SDK from '../../src/index';

describe('Tesouro SDK', () => {
  describe('module exports', () => {
    it('should export TesouroClient', () => {
      expect(SDK.TesouroClient).toBeDefined();
      expect(typeof SDK.TesouroClient).toBe('function');
    });

    it('should export ApiClient', () => {
      expect(SDK.ApiClient).toBeDefined();
      expect(typeof SDK.ApiClient).toBe('function');
    });

    it('should export error classes', () => {
      expect(SDK.SdkError).toBeDefined();
      expect(SDK.NetworkError).toBeDefined();
      expect(SDK.GraphQLError).toBeDefined();
      expect(SDK.ResponseError).toBeDefined();
    });

    it('should export authentication classes', () => {
      expect(SDK.AuthManager).toBeDefined();
    });

    it('should export utility functions', () => {
      expect(SDK.makeRequest).toBeDefined();
      expect(SDK.makeGraphQLRequest).toBeDefined();
      expect(SDK.createClient).toBeDefined();
    });
  });
});
