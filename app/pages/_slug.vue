<!-- Template for dynamic pages-->
<template>
  <div>
    <h1>{{ page.title }}</h1>
    <!-- eslint-disable vue/no-v-html -->
    <div v-if="page.content" v-html="page.content" />
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios, $config: { apiUrl } }) {
    const page = await $axios
      .$get(`${apiUrl}/pages/${params.slug}`)
      .then((content) => content)
      .catch((e) => {
        console.log(e)
      })
    return { page }
  },
  data() {
    return {
      apiUrl: process.env.strapiBaseUri,
    }
  },
}
</script>
