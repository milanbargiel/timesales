<template>
  <div v-if="isLoading" class="dot-container">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
  <div v-else>
    <SandSimulation
      :duration="order.time"
      :progress="order.progress"
      @save-progress="handleSaveProgress"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      order: {},
      progress: 0,
      sandSim: '',
    }
  },
  created() {
    if (typeof this.$route.query.key === 'undefined') {
      this.$router.push('/404')
    }

    // If query parameter "key" is in Url fetch order data
    this.fetchOrder(this.$route.query.key)
  },
  methods: {
    fetchOrder(key) {
      this.$axios
        .$get(`${process.env.apiUrl}/orders/${key}`)
        .then((res) => {
          this.isLoading = false
          this.order = res
          this.progress = res.progress
        })
        // Redirect if order was not found
        .catch(() => {
          this.$router.push('/404')
        })
    },
    handleSaveProgress(emittedProgress) {
      // Only save progress when it differs from previous progress
      if (this.progress === emittedProgress) {
        return
      }

      this.progress = emittedProgress
      // Save progress in db (only accepts numbers between 0 and 1)
      this.$axios.$put(`${process.env.apiUrl}/orders/${this.order.key}`, {
        progress: this.progress,
      })
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
