<template>
  <div>
    <h1>Stream</h1>
    <p>{{ order.time }}</p>
    <p>{{ order.progress }}</p>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios, redirect }) {
    // Fetch Order From API
    try {
      const order = await $axios.$get(
        `${process.env.baseUrl}orders/${params.key}`
      )

      return { order }
    } catch {
      // Redirect to 404 Page when order is not found on server
      return redirect('/404')
    }
  },
}
</script>
