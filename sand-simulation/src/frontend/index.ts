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

  console.log("INIT STREAM", { ...arguments[0] });

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
  let isSimFinished = false;

  async function updateSim() {
    if (_promise) return;
    isSimFinished = await backend.IsFinished();
    _promise = await backend.Update(timeKeeper.getProgress());
    updates = _promise;
    _promise = false;
  }

  async function update() {
    if (!simPaused && !isResizing && !isSimFinished) {
      /*-->*/ await performanceKeeper.start();
      await updateSim();
      timeKeeper.update();
      sound.setVolume(Math.min(0.05, updates / 4000000));
      canvas.update();
      /*-->*/ await performanceKeeper.end();
    } else {
      sound.pause();
    }

    requestAnimationFrame(update);
  }

  window.addEventListener(
    "resize",
    debounce(() => {
      const { width: _w, height: _h } = getDims();
      resize(_w, _h);
    }, 500)
  );

  update();
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

function play() {
  if (simPaused) {
    simPaused = false;
    timeKeeper.resume();
    sound.resume();
  }
}

function getProgress() {
  return timeKeeper.getProgress();
}

window.addEventListener("blur", pause);
window.addEventListener("focus", play);
window.addEventListener("mouseover", play);
window.addEventListener("mouseout", play);

export default {
  init,
  play,
  pause,
  getProgress,
};
