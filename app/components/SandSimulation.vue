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
  width: 100vw;
  height: 100vh;
  image-rendering: pixelated;
}
</style>
