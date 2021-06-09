import createBackend from "./createBackend";
import createCanvas from "./createCanvas";
import createSound from "./createSound";
import { debounce, getDims } from "./helpers";
import createPerformanceKeeper from "./perfomanceKeeper";
import timeKeeper from "./timeKeeper";

let backend: Backend;
let canvas: ReturnType<typeof createCanvas>;
let sound: ReturnType<typeof createSound>;

let simPaused = false;

async function init({
  duration,
  progress,
  wasmPath,
}: {
  duration: number;
  progress: number;
  wasmPath: string;
}) {
  let { width, height } = getDims();

  let pixels = new Uint8Array(width * height);

  // This is ugly but i have not found a
  // better way to pass a reference of this array
  // to the wasm backend
  window["sandPixelArray"] = pixels;

  backend = await createBackend(wasmPath);
  await backend.CreateCanvas(width, height);

  canvas = createCanvas({ pixels, width, height });

  sound = createSound();

  timeKeeper.setDuration(duration || 60);
  timeKeeper.setProgress(progress || 1);

  function resize(_w, _h) {
    if (_w != width || _h != height) {
      width = _w;
      height = _h;

      pixels = new Uint8Array(width * height);
      window["sandPixelArray"] = pixels;
      backend.Resize(width, height);
      canvas.resize(width, height, pixels);
    }
  }

  const performanceKeeper = createPerformanceKeeper(resize);

  let _promise;
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
      performanceKeeper.start();
      updateSim();
      timeKeeper.update();
      sound.resume();
      sound.setVolume(Math.min(0.05, updates / 4000000));
      canvas.update();
      performanceKeeper.end();
    } else {
      sound.pause();
    }

    requestAnimationFrame(render);
  }

  window.addEventListener(
    "resize",
    debounce(() => {
      const { width: _w, height: _h } = getDims();
      resize(_w, _h);
    }, 500)
  );

  render();
}

function pause() {
  simPaused = !simPaused;
  if (simPaused) {
    timeKeeper.pause();
    sound.pause();
  } else {
    timeKeeper.resume();
    sound.resume();
  }
}

function getProgress() {
  return timeKeeper.getProgress();
}

export default {
  init,
  pause,
  getProgress,
};
