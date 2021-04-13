<template>
  <div v-if="isLoading" class="dot-container">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
  <div v-else>
    <p>You have bought: {{ order.time }} ms</p>
    <p>Your progress is: {{ order.progress }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      order: {},
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
    saveProgress(progress) {
      // Endpoint only accepts numbers between 0 and 1 for progress field
      this.$axios.$put(`https://xyz.timesales.ltd/orders/agqOvHcpTv`, {
        progress,
      })
    },
    fetchOrder(key) {
      this.$axios
        .$get(`https://xyz.timesales.ltd/orders/${key}`)
        .then((res) => {
          this.isLoading = false
          this.order = res
        })
        // Redirect if order was not found
        .catch(() => {
          this.$router.push('/404')
        })
    },
  },
}
</script>
