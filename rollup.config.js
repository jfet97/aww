import cleanup from "rollup-plugin-cleanup";
import minify from "rollup-plugin-babel-minify";
import pkg from "./package.json";

export default {
  input: "src/index.js",
  output: [
    {
      file: pkg.main,
      format: "umd",
      sourcemap: true,
      name: "aww"
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {})
  ],
  plugins: [
    cleanup({
      comments: "none",
      extensions: ["js"]
    }),
    minify({}),
  ]
};
