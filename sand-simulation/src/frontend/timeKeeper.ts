import { getSeconds } from "./helpers";

let duration = 60;
let time = 0;
let progress = 1;
let isPaused = false;

let lN;
let lastTime = getSeconds();
const update = () => {

  if (isPaused) return;

  let cTime = getSeconds();

  let elapsedTimeSinceLastUpdate = cTime - lastTime;


  time += elapsedTimeSinceLastUpdate;

  if (elapsedTimeSinceLastUpdate > 0) {
    lastTime = cTime;
  }


  const n = duration - time;
  progress = Math.floor(n / duration * 100) / 100;
  if (!lN) lN = n;


  lN = n;
}

function pause() {
  isPaused = true;
  console.log("[TIME] paused")
}

function resume() {
  lastTime = getSeconds();
  isPaused = false;
  console.log("[TIME] unpaused")
}


function setDuration(d) {
  console.log("[TIME] set duration ", d);
  duration = d;
}


function getProgress() {
  return progress;
}

function setProgress(p) {
  time = duration - Math.floor(duration * p);
  console.log("[TIME] set progress ", time);
}


export default {
  update,
  getProgress,
  setDuration,
  setProgress,
  pause,
  resume
}