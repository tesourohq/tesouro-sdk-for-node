/**
 * Polyfills for Node 18.x compatibility with undici 7.17+
 *
 * undici 7.17+ expects certain Web APIs (File, Blob) to be globally available.
 * These are globals in Node 20+, but in Node 18.x they need to be polyfilled.
 */

import { File, Blob } from 'node:buffer';

const g = globalThis as typeof globalThis & { File?: typeof File; Blob?: typeof Blob };

if (typeof g.File === 'undefined') {
  g.File = File;
}

if (typeof g.Blob === 'undefined') {
  g.Blob = Blob;
}
