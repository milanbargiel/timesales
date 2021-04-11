import { Go } from "./helpers"

const go = new Go();

let wasm;

export default (WASM_URL = 'build/sand-backend.wasm'): Promise<Backend> => new Promise((resolve, reject) => {

  if ('instantiateStreaming' in WebAssembly) {
    WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then(function (obj) {
      wasm = obj.instance;
      go.run(wasm);
      resolve(wasm.exports);
    })
  } else {
    fetch(WASM_URL).then(resp =>
      resp.arrayBuffer()
    ).then(bytes =>
      WebAssembly.instantiate(bytes, go.importObject).then(function (obj) {
        wasm = obj.instance;
        go.run(wasm);
        resolve(wasm.exports);
      })
    )
  }
});