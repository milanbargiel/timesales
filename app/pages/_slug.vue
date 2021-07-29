<!-- Template for dynamic pages-->
<template>
  <div class="page-content">
    <h1>{{ page.title }}</h1>
    <!-- eslint-disable vue/no-v-html -->
    <!-- $md.render parses markdown to html -->
    <div v-if="page.content" v-html="$md.render(page.content)" />
  </div>
</template>

<script>
export default {
  // Get page data from Backend
  // Static pages are created from Api when running 'npm run generate'
  // This happens on netlify deployment
  // A webhook triggers a redeploy from Strapi, when content is changed
  // In development mode, dynamic routes are fetched on all pages refreshes
  async asyncData({ params, redirect, $axios, $config: { apiUrl } }) {
    const page = await $axios
      .$get(`${apiUrl}/pages/${params.slug}`)
      .then((content) => content)
      .catch((e) => {
        redirect('/404')
      })
    return { page }
  },
}
</script>
