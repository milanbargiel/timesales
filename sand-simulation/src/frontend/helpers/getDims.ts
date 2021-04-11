export default () => {


  let width = 200;
  let height = 200;


  if (process["browser"]) {
    width = window.innerWidth
    height = window.innerHeight
  }

  let scale = 0.5

  width *= scale
  height *= scale

  const dpr = window.devicePixelRatio || 1;

  width *= dpr;
  height *= dpr

  height = Math.round(height / 100) * 100;
  width = Math.round(width / 100) * 100;

  return {
    width,
    height
  }
}