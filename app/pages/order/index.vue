<template>
  <div v-if="isLoading" class="dot-container">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
  <div v-else>
    <div v-if="!showStream">
      <ShowStreamPrompt @show-stream="(res) => (showStream = res)" />
    </div>
    <div v-else>
      <SandSimulation
        :duration="order.time"
        :initial-progress="order.progress"
        @save-progress="handleSaveProgress"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      showStream: false,
      botui: '',
      order: {},
    }
  },
  created() {
    // Fetch order data with query parameter "key" in URL
    if (typeof this.$route.query.key === 'undefined') {
      this.$router.push('/404')
    }

    this.fetchOrder(this.$route.query.key)
  },
  methods: {
    fetchOrder(key) {
      this.$axios
        .$get(`${this.$config.apiUrl}/orders/${key}`)
        .then((res) => {
          this.isLoading = false
          this.order = res
        })
        // Redirect if order was not found
        .catch(() => {
          this.$router.push('/404')
        })
    },
    handleSaveProgress(progress) {
      // Save progress in db (only accepts numbers between 0 and 1)
      this.$axios.$put(`${this.$config.apiUrl}/orders/${this.order.key}`, {
        progress,
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
