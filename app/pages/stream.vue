<template>
  <sandsimulation />
</template>

<script>
export default {
  data() {
    return {
      sandSim: '',
    }
  },
  async mounted() {
    await this.$nextTick()
    this.sandSim = this.$sandSim('sand-simulation')
  },
  methods: {
    toggle() {},
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
