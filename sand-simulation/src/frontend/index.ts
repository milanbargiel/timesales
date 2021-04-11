import createBackend from "./createBackend";
import createCanvas from "./createCanvas";
import createSound from "./createSound";
import { debounce, getDims } from "./helpers";
import timeKeeper from "./timeKeeper";


let backend: Backend;
let canvas: ReturnType<typeof createCanvas>;
let sound: ReturnType<typeof createSound>;

let simPaused = false

async function init({ duration, progress, wasmPath }: { duration: number, progress: number, wasmPath: string }) {

  let { width, height } = getDims();

  let pixels = new Uint8Array(width * height);

  // This is ugly but i have not found a
  // better way to pass a reference of this array
  // to the wasm backend
  window["sandPixelArray"] = pixels;

  backend = await createBackend(wasmPath);
  await backend.CreateCanvas(width, height);

  canvas = createCanvas({ pixels, width, height })

  sound = createSound();

  timeKeeper.setDuration(duration || 120);
  timeKeeper.setProgress(progress || 1);


  let _promise
  let updates = 100;
  let isResizing = false;

  async function updateSim() {
    if (_promise) return;
    _promise = await backend.Update(timeKeeper.getProgress());
    updates = _promise;
    _promise = false;
  }


  async function render() {
    if (!simPaused && !isResizing && timeKeeper.getProgress() > -0.05) {
      timeKeeper.update();
      canvas.update();
      updateSim();
      sound.setVolume(Math.min(0.05, updates / 4000000))
    }
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", debounce(async () => {

    const { width: _w, height: _h } = getDims();

    if (_w != width || _h != height) {

      width = _w;
      height = _h;

      pixels = new Uint8Array(width * height);

      window["sandPixelArray"] = pixels;

      canvas.resize(width, height, pixels);
      backend.Resize(width, height);
    }

  }, 500))


  render();

}

function pause() {
  simPaused = !simPaused;
  if (simPaused) {
    timeKeeper.pause();
    sound.setVolume(0);
  } else {
    timeKeeper.resume();
  }
}

function getProgress() {
  return timeKeeper.getProgress();
}

export default {
  init, pause, getProgress
}