import esbuild from "esbuild";
import chokidar from "chokidar";
import liveServer from "live-server";
import { glslify } from "esbuild-plugin-glslify";
import buildWasm from "./build-wasm.mjs";

const watch = process.argv[2] === "--watch";

const watcher = {
  onRebuild(error, result) {
    if (error) console.error("build failed", error);
    else console.error("build succeeded");
  },
};

esbuild.build({
  entryPoints: ["./src/frontend/index.ts"],
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
      compress: true,
    }),
  ],
  logLevel: "info",
});

if (watch) {
  let timeout = false;
  setTimeout(() => {
    timeout = true;
  }, 1000);
  chokidar.watch("src/backend/**/*.go").on("all", (event, path) => {
    timeout && buildWasm();
  });

  liveServer.start({
    root: "public",
  });
}
