import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  // esm + cjs for bundlers/node, iife for a plain <script> CDN drop (Webflow / static HTML).
  format: ['esm', 'cjs', 'iife'],
  globalName: 'CohostPaymentElement',
  outDir: 'dist',
  minify: true,
  target: 'es2020',
});
