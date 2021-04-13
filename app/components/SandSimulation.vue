<template>
  <div></div>
</template>

<script>
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
  data() {
    return {
      sandSim: '',
    }
  },
  mounted() {
    // Use plugin defined in plugins/sand-simulation
    this.sandSim = this.$sandSim(this.duration, this.progress)
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
