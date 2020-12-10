import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/js/index.ts',
  output: {
    dir: 'public/js',
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    typescript({
      target: "es2015",
      outDir: "public/js"
    }),
    process.env.NODE_ENV === 'production' ? terser() : undefined,
  ]
};
