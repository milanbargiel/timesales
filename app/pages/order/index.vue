<template>
  <div>
    <h1>Stream</h1>
    <p>{{ order.time }}</p>
    <p>{{ order.progress }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
