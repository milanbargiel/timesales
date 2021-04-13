<template>
  <div v-if="isLoading" class="dot-container">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
  <div v-else>
    <SandSimulation :duration="order.time" :progress="order.progress" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      order: {},
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
        })
        // Redirect if order was not found
        .catch(() => {
          this.$router.push('/404')
        })
    },
    saveProgress(progress) {
      // Endpoint only accepts numbers between 0 and 1 for progress field
      this.$axios.$put(`${process.env.apiUrl}/orders/${this.order.key}`, {
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
