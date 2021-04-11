import esbuild from 'esbuild';
import chokidar from "chokidar";
import liveServer from "live-server";
import { glslify } from "esbuild-plugin-glslify"
import buildWasm from './build-wasm.mjs';

const watch = process.argv[2] === "--watch";

const watcher = {
  onRebuild(error, result) {
    if (error) console.error('watch build failed:', error)
    else console.error('watch build succeeded:', result)
  },
}

esbuild.build({
  entryPoints: ['./src/frontend/index.ts'],
  bundle: true,
  minify: false,
  format: "esm",
  platform: "node",
  target: "esnext",
  sourcemap: true,
  outfile: "public/build/sand-bundle.js",
  watch: watch ? watcher : false,
  plugins: [
    glslify({
      minify: true,
      compress: true
    }),
  ],
  logLevel: "info"
})

if (watch) {
  chokidar.watch('src/backend/**/*.go').on('all', (event, path) => {
    buildWasm();
  });

  liveServer.start({
    root: "public"
  });
}
