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
    // load bot modules
    await this.$nextTick()
    this.sandSim = this.$sandSim('sand-simulation')
  },
  methods: {
    toggle() {
      // TODO: Implement that fast forwards delay processes on click
      // console.log(this.botui.message.get(0))
    },
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
