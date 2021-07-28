<!-- Template for dynamic pages-->
<template>
  <div>
    <h1>{{ page.title }}</h1>
    <!-- eslint-disable vue/no-v-html -->
    <!-- $md.render parses markdown to html -->
    <div v-if="page.content" v-html="$md.render(page.content)" />
  </div>
</template>

<script>
export default {
  // Static pages are created from dynamic Strapi data on Netlify deploy
  // A webhook triggers a redeploy from Strapi, when content is changed
  // In development mode, dynamic routes work out of the box
  async asyncData({ params, redirect, $axios, $config: { apiUrl } }) {
    const page = await $axios
      .$get(`${apiUrl}/pages/${params.slug}`)
      .then((content) => content)
      .catch((e) => {
        redirect('/404')
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
