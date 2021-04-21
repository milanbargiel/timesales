import { exec } from "child_process";

const buildWasm = (w) => {
  const a = Date.now();
  exec("make build-wasm", (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log("[WASM] Build in " + (Date.now() - a) + "ms");
      //console.log(res);
    }
  });
};
buildWasm();

export default buildWasm;
