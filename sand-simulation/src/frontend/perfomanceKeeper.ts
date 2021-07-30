import { getDims } from "./helpers";

export default (resize) => {
  let t,
    i = 0;
  let measurements = [];

  const optimalMS = 25;
  const worstMaxMS = 100;

  const dims = getDims();

  return {
    start: () => {
      t = performance.now();
    },
    end: () => {
      i++;

      // Make sure we only collect 120 measurements, eg 2 seconds
      measurements = [...measurements.slice(-119), performance.now() - t];

      // Every second
      if (i % 60 == 0) {
        // Calculate the average execution time
        let sum = 0;
        for (let i = 0; i < measurements.length; i++) {
          sum += measurements[i];
        }
        const avg = Math.floor(sum / measurements.length);

        // Dont do anything if we are around 20ms of the optimal ms
        if (avg > optimalMS - 20 && avg < optimalMS + 20) return;
        console.log("[PERF] ", avg, "ms");

        if (avg < optimalMS) {
          // If we are below the optimal ms
          // we can scale up a bit
          const howGoodIsIt = (optimalMS - avg) / optimalMS;

          const s = 1 + howGoodIsIt * 0.25;
          console.log("[PERF] increase scale by", s);

          dims.scale = Math.min(dims.scale * s, 2);
        } else {
          const howBadIsIt = Math.min(avg - optimalMS, worstMaxMS) / worstMaxMS;

          const s = 1 - howBadIsIt * 0.25;
          console.log("[PERF] decrease scale by", s);
          dims.scale *= s;
        }

        // Apply the scale calculated above
        const { width, height } = getDims();
        resize(width, height);
      }
    },
  };
};
