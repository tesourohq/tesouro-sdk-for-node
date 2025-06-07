import * as fs from 'fs';
import * as path from 'path';

describe('Build System', () => {
  const distPath = path.join(__dirname, '..', 'dist');

  beforeAll(() => {
    // Ensure build has been run
    if (!fs.existsSync(distPath)) {
      throw new Error('Build not found. Run "npm run build" before running tests.');
    }
  });

  describe('Directory Structure', () => {
    it('should create all required output directories', () => {
      expect(fs.existsSync(path.join(distPath, 'cjs'))).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'esm'))).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'types'))).toBe(true);
    });

    it('should create main entry points', () => {
      expect(fs.existsSync(path.join(distPath, 'cjs', 'index.js'))).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'esm', 'index.js'))).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'types', 'index.d.ts'))).toBe(true);
    });

    it('should create source maps', () => {
      expect(fs.existsSync(path.join(distPath, 'cjs', 'index.js.map'))).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'esm', 'index.js.map'))).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'types', 'index.d.ts.map'))).toBe(true);
    });
  });

  describe('CommonJS Output', () => {
    let cjsContent: string;

    beforeAll(() => {
      cjsContent = fs.readFileSync(path.join(distPath, 'cjs', 'index.js'), 'utf8');
    });

    it('should use CommonJS module syntax', () => {
      expect(cjsContent).toContain('Object.defineProperty(exports, "__esModule"');
      expect(cjsContent).toContain('exports.');
      expect(cjsContent).toContain('require(');
    });

    it('should not contain ES module syntax', () => {
      expect(cjsContent).not.toContain('export {');
      expect(cjsContent).not.toContain('import {');
      expect(cjsContent).not.toContain('export function');
      expect(cjsContent).not.toContain('export const');
    });

    it('should be loadable as CommonJS module', () => {
      const modulePath = path.join(distPath, 'cjs', 'index.js');
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const module = require(modulePath);
        expect(module).toBeDefined();
        expect(module.hello).toBeDefined();
        expect(module.version).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('ES Module Output', () => {
    let esmContent: string;

    beforeAll(() => {
      esmContent = fs.readFileSync(path.join(distPath, 'esm', 'index.js'), 'utf8');
    });

    it('should use ES module syntax', () => {
      expect(esmContent).toContain('export {');
      // Note: index.js may not have imports if it only re-exports, but other files should
      expect(esmContent).toMatch(/export\s+(function|const|{)/);
    });

    it('should not contain CommonJS syntax', () => {
      expect(esmContent).not.toContain('Object.defineProperty(exports');
      expect(esmContent).not.toContain('exports.');
      expect(esmContent).not.toContain('require(');
    });

    it('should have proper exports', () => {
      expect(esmContent).toContain('export function hello()');
      expect(esmContent).toContain('export const version =');
    });

    it('should use import statements in other ES module files', () => {
      const clientPath = path.join(distPath, 'esm', 'client.js');
      if (fs.existsSync(clientPath)) {
        const clientContent = fs.readFileSync(clientPath, 'utf8');
        expect(clientContent).toContain('import {');
      }
    });
  });

  describe('TypeScript Declarations', () => {
    let typesContent: string;

    beforeAll(() => {
      typesContent = fs.readFileSync(path.join(distPath, 'types', 'index.d.ts'), 'utf8');
    });

    it('should contain type declarations', () => {
      expect(typesContent).toContain('export {');
      expect(typesContent).toContain('declare function');
      expect(typesContent).toContain('declare const');
    });

    it('should export types', () => {
      expect(typesContent).toContain('type ');
    });

    it('should reference source maps', () => {
      expect(typesContent).toContain('//# sourceMappingURL=');
    });
  });

  describe('Generated Client Files', () => {
    it('should create generated client in all targets', () => {
      expect(fs.existsSync(path.join(distPath, 'cjs', 'generated', 'client-methods.js'))).toBe(
        true
      );
      expect(fs.existsSync(path.join(distPath, 'esm', 'generated', 'client-methods.js'))).toBe(
        true
      );
      expect(fs.existsSync(path.join(distPath, 'types', 'generated', 'client-methods.d.ts'))).toBe(
        true
      );
    });

    it('should create generated types in all targets', () => {
      expect(fs.existsSync(path.join(distPath, 'cjs', 'generated', 'types.js'))).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'esm', 'generated', 'types.js'))).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'types', 'generated', 'types.d.ts'))).toBe(true);
    });
  });

  describe('Module Resolution', () => {
    it('should be able to load CommonJS module and call functions', () => {
      const modulePath = path.join(distPath, 'cjs', 'index.js');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const cjsModule = require(modulePath);

      expect(cjsModule.hello()).toBe('Hello from Tesouro SDK!');
      expect(cjsModule.version).toBe('0.0.1');
      expect(cjsModule.ApiClient).toBeDefined();
      expect(cjsModule.SdkError).toBeDefined();
    });
  });

  describe('Package.json Exports', () => {
    let packageJson: any;

    beforeAll(() => {
      const packagePath = path.join(__dirname, '..', 'package.json');
      packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    });

    it('should have correct main fields', () => {
      expect(packageJson.main).toBe('dist/cjs/index.js');
      expect(packageJson.module).toBe('dist/esm/index.js');
      expect(packageJson.types).toBe('dist/types/index.d.ts');
    });

    it('should have proper exports field', () => {
      expect(packageJson.exports).toBeDefined();
      expect(packageJson.exports['.']).toBeDefined();
      expect(packageJson.exports['.'].import).toBe('./dist/esm/index.js');
      expect(packageJson.exports['.'].require).toBe('./dist/cjs/index.js');
      expect(packageJson.exports['.'].types).toBe('./dist/types/index.d.ts');
    });
  });
});
