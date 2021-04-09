<template>
  <div>
    <h1>Stream</h1>
    <p>{{ order.time }}</p>
    <p>{{ order.progress }}</p>
    <input v-model="progress" placeholder="Value between 0 and 1" />
    <button @click="saveProgress(progress)">Save Progress</button>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios, redirect }) {
    // Fetch Order From API
    // try {
    //   const order = await $axios.$get(
    //     `https://xyz.timesales.ltd/orders/${params.key}`
    //   )

    //   return { order } // order is saved to global scope
    // } catch {
    //   // Redirect to 404 Page when order is not found on server
    //   return redirect('/404')
    // }
    const order = await $axios.$get(
      `https://xyz.timesales.ltd/orders/${params.key}`
    )

    return { order } // order is saved to global scope
  },
  methods: {
    saveProgress(progress) {
      // Endpoint only accepts numbers between 0 and 1 for progress field
      this.$axios.$put(`https://xyz.timesales.ltd/orders/${this.order.key}`, {
        progress,
      })
    },
  },
}
</script>
