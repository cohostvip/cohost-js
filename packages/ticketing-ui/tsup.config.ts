import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@cohostvip/cohost-react',
    '@cohostvip/cohost-node',
  ],
  sourcemap: true,
  target: 'es2022',
})
