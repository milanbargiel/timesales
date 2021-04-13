<template>
  <div></div>
</template>

<script>
import sandSim from 'sand-simulation'

export default {
  name: 'SandSimulation',
  props: {
    duration: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    // Use sand simulation plugin defined in plugins/sand-simulation
    sandSim.init({
      duration: this.duration,
      progress: this.progress,
      wasmPath: '/sand-backend.wasm',
    })

    // Periodically save progress in Strapi backend (1/s)
    setInterval(() => {
      this.$emit('save-progress', sandSim.getProgress())
    }, 1000)
  },
}
</script>

<style>
canvas {
  pointer-events: none;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw !important;
  height: 100vh !important;
  min-width: 600px;
  min-height: 600px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
