<template>
  <div class="controls controls--bottom">
    <div class="pause-button" @click="pause">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <defs>
          <style>
            polygon,
            rect {
              fill: #fff;
              stroke: #000;
            }
          </style>
        </defs>
        <g v-if="paused">
          <polygon points="8.56 5.37 42.17 24.7 8.56 44.4 8.56 5.37" />
        </g>

        <g v-else>
          <rect x="9" y="5" width="9" height="38" />
          <rect x="27" y="5" width="9" height="38" />
        </g>
      </svg>
    </div>
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
.controls {
  display: flex;
  align-items: center;
}

canvas {
  pointer-events: none;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw !important;
  height: 100vh !important;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: crisp-edges;
}

svg {
  display: block;
  width: 30px;
  height: 30px;
}
</style>
