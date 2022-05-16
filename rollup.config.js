import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "app/assets/javascripts/application.js",
  output: [
    {
      file: "dist/assets/javascripts/application.js",
      format: "iife",
      sourcemap: "inline",
    },
    {
      file: "dist/assets/javascripts/application.min.js",
      format: "cjs",
      plugins: [terser()],
    },
  ],
  plugins: [
    nodeResolve({ browser: true }),
    commonjs({
      include: /node_modules/,
    }),
  ],
};
