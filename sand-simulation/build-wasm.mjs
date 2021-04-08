
import { exec } from "child_process";

const buildWasm = (w) => exec("make build-wasm", (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res);
  }
})

buildWasm();

export default buildWasm;