export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Timesales',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'robots', content: 'noindex,nofollow' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ src: 'https://js.stripe.com/v3', defer: true }],
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

  // Reads .env file
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },

  // Allow devtool extension in Firefox
  vue: {
    config: {
      devtools: true,
    },
  },
}
