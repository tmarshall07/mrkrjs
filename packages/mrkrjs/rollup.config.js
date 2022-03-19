import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const name = 'mrkrjs';
const input = './src/index.ts';
const external = (id) => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');
const minifierPlugin = terser({
  compress: {
    passes: 2,
  },
});

const typescriptPlugin = typescript({ tsconfig: '../../tsconfig.json', outputToFilesystem: false });

const esm = {
  input,
  output: {
    file: `dist/${name}.esm.js`,
    format: 'esm',
  },
  external,
  plugins: [typescriptPlugin, resolve(), minifierPlugin],
};

const cjs = {
  input,
  output: {
    file: `dist/${name}.cjs.js`,
    format: 'cjs',
  },
  external,
  plugins: [resolve(), typescriptPlugin, minifierPlugin],
};

// const umdDev = {
//   input,
//   output: { file: `dist/${name}.js`, format: 'umd', name: name, globals },
//   external,
//   plugins: [
//     // sourceMaps(),
//     resolve(),
//     typescript({ tsconfig: '../../tsconfig.json' }),
//     replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
//   ],
// };

export default [
  esm,
  cjs,
  //  umdDev
];
