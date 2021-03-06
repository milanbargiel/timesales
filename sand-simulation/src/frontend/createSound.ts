export default () => {
  var AudioContext =
    window.AudioContext || // Default
    window["webkitAudioContext"] || // Safari and old versions of Chrome
    false;

  if (!AudioContext) {
    return {
      setVolume: (v) => {},
    };
  }

  const ctx: AudioContext = new AudioContext();

  const bufferSize = 4096;
  const pinkNoise = (function () {
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    //const node = new AudioWorkletNode(ctx, "");
    const node = ctx.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function (e) {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.011; // (roughly) compensate for gain
        b6 = white * 0.115926;
      }
    };
    return node;
  })();

  const gainNode = ctx.createGain();

  gainNode.gain.value = 0.1;

  pinkNoise.connect(gainNode);

  gainNode.connect(ctx.destination);

  return {
    setVolume: (v) => {
      gainNode.gain.value = v;
    },
    pause() {
      ctx.state === "running" && ctx.suspend();
    },
    resume() {
      ctx.state !== "running" && ctx.resume();
    },
  };
};
