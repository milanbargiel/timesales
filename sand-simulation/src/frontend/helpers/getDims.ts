let scale = 0.5;

export default () => {
  let width = 200;
  let height = 200;

  if (process["browser"] || "innerWidth" in globalThis) {
    width = window.innerWidth;
    height = window.innerHeight;
  }

  width *= scale;
  height *= scale;

  height = Math.round(height / 100) * 100;
  width = Math.round(width / 100) * 100;

  return {
    width,
    height,
    get scale() {
      return scale;
    },
    set scale(v) {
      scale = v;
    },
  };
};
