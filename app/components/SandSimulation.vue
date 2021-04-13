<template>
  <div class="controls">
    <span class="seconds-left">Seconds left: {{ timeLeft }}</span>
    <span class="pause-button" @click="pause">{{
      paused ? 'Continue' : 'Pause'
    }}</span>
  </div>
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
    initialProgress: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      timeLeft: null,
      progress: null,
      paused: null,
    }
  },
  mounted() {
    // Use sand simulation plugin defined in plugins/sand-simulation
    sandSim.init({
      duration: this.duration,
      progress: this.initialProgress,
      wasmPath: '/sand-backend.wasm',
    })
    // Periodically save progress in Strapi backend (1/s)
    setInterval(() => {
      // Reduce count by one optimistically
      if (!this.paused) {
        this.timeLeft = this.timeLeft - 1
      }

      // Only save progress when it differs from previous progress
      if (this.progress !== sandSim.getProgress()) {
        this.progress = sandSim.getProgress()
        this.timeLeft = this.duration * this.progress
        this.$emit('save-progress', this.progress)
      }
    }, 1000)
  },
  methods: {
    pause() {
      this.paused = !this.paused
      sandSim.pause()
    },
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
