import typescript from '@rollup/plugin-typescript';
// import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const name = 'mrkrjs';
const input = './src/index.ts';
const extensions = ['.js', '.ts'];
const external = (id) => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');
const minifierPlugin = terser({
  compress: {
    passes: 2,
  },
});

const typescriptPlugin = typescript({ tsconfig: '../../tsconfig.json', outputToFilesystem: false });

export default {
  input,
  output: [
    {
      file: `dist/${name}.esm.js`,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: `dist/${name}.esm.min.js`,
      format: 'esm',
      plugins: [minifierPlugin],
      sourcemap: true,
    },
    {
      file: `dist/${name}.js`,
      format: 'umd',
      name,
      sourcemap: true,
    },
    {
      file: `dist/${name}.min.js`,
      format: 'umd',
      name,
      plugins: [minifierPlugin],
      sourcemap: true,
    },
  ],
  external,
  plugins: [
    typescriptPlugin,
    resolve({ extensions }),
    // babel({ babelHelpers: 'bundled', include: ['src/**/*.ts'], extensions, exclude: './node_modules/**' }),
  ],
};
