import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/js/index.ts',
  output: {
    dir: 'public/js',
    format: 'esm'
  },
  plugins: [
    nodeResolve(),
    // b/c Redux using process.env.NODE_ENV
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    typescript({
      tsconfig: "./src/js/tsconfig.json"
    }),
    process.env.NODE_ENV === 'production' ? terser() : undefined,
  ]
};
