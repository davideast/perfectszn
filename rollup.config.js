import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/js/index.ts',
  output: {
    dir: 'public/js',
    format: 'iife'
  },
  plugins: [
    typescript(),
    nodeResolve(),
  ]
};
