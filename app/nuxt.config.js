import axios from 'axios'

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const apiUrl = process.env.API_URL || 'http://localhost:1337'

// Dynamically generate routes
// These routes will be statically generated and deployed to the CDN netlify
const dynamicRoutes = () => {
  return axios.get(`${apiUrl}/pages`).then((res) => {
    return res.data.map((page) => `/${page.slug}`)
  })
}

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Time Sales Online | Buy time online',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Are you sometimes short on time? We offer custom solutions for your personal time management.',
      },
      // Link preview information for sharing on Facebook, iMessage, Whatsapp etc.
      // Based on the Open graph protocol.
      {
        property: 'og:title',
        content: 'Time Sales Online - World leader in the time business',
      },
      {
        property: 'og:site_name',
        content: 'Time Sales Online',
      },
      {
        property: 'og:description',
        content: 'Buy time online',
      },
      {
        property: 'og:url',
        content: baseUrl,
      },
      {
        property: 'og:image',
        content: `${baseUrl}/timesales-poster.png`,
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: 'normalize.css/normalize.css', lang: 'css' },
    { src: '@/assets/styles.scss', lang: 'scss' },
    // Load botui css
    { src: 'botui/build/botui.min.css', lang: 'css' },
    { src: 'botui/build/botui-theme-default.css', lang: 'css' },
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~/plugins/botui.js', mode: 'client' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Disable progress bar
  loading: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/markdownit',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      // extend webpack config to make botui work
      config.resolve.alias.vue = 'vue/dist/vue.min.js'
    },
    transpile: ['sand-simulation'],
  },

  // Pass data from .env to the nuxt context
  publicRuntimeConfig: {
    baseUrl,
    apiUrl,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },

  // Exlude order page from static file generation and use custom fallback instead of default 404 one.
  // Deploy static pages of dynamic routes during generation
  generate: {
    exclude: [/^\/order/],
    fallback: 'spa.html',
    routes: dynamicRoutes,
  },

  // Allow devtool extension in Firefox
  vue: {
    config: {
      devtools: true,
    },
  },
  // Configuration for markdown parser
  // https://markdown-it.github.io/
  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    injected: true,
    html: true,
  },
}
