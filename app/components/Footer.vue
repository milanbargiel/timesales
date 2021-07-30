<template>
  <div v-if="showFooter" class="footer-container">
    <footer v-if="footerUnfolded" class="footer">
      <div></div>
      <div class="creators">
        <div class="creators-header">Partners:</div>
        <a
          class="link link--underlined"
          href="https://www.milanbargiel.com/"
          target="_blank"
          >Milan Bargiel</a
        >
        <a
          class="link link--underlined"
          href="https://jim-fx.com"
          target="_blank"
          >Jim-Fx</a
        >
        <a class="link link--underlined">Katherina Gorodynska</a>
        <a class="link link--underlined">Ludwig Lederer</a>
        <a
          class="link link--underlined"
          href="http://biomigrant.co"
          target="_blank"
          >Biomigrant</a
        >
        <a class="link link--underlined">Layla Ansari</a>
      </div>
      <div class="navigation">
        <NuxtLink class="link" to="/">Buy time</NuxtLink>
        <NuxtLink v-for="link in links" :key="link.slug" :to="link.slug">{{
          link.title
        }}</NuxtLink>
        <div class="footer-branding">
          World leaders in the time business since 2018.
        </div>
      </div>
      <div class="patrons">
        <SvgsKulturNrw />
        <SvgsLabK />
        <SvgsBergLawyers />
        <div class="debug-toggle">
          <label class="switch">
            <input
              v-model="debugMode"
              type="checkbox"
              @click="toggleDebugMode"
            />
            <div></div>
          </label>
          Fast conversation
        </div>
      </div>
    </footer>
    <Triangle
      class="footer-toggle"
      :unfolded="footerUnfolded"
      @click.native="toggleFooter"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex' // helper for mapping vuex store mutations to methods

export default {
  data() {
    return {
      footerUnfolded: false,
      links: [],
    }
  },
  // Fetch links from public pages from backend
  // Happens during static page generation
  async fetch() {
    this.links = await fetch(`${this.$nuxt.context.$config.apiUrl}/pages`).then(
      (res) => res.json()
    )
  },
  computed: {
    debugMode() {
      return this.$store.state.ui.debugMode
    },
    // In sand simulation on the order page the footer is hidden
    showFooter() {
      return this.$store.state.ui.showFooter
    },
  },
  methods: {
    ...mapMutations({
      // Enables this.toggleDebugMode()
      toggleDebugMode: 'ui/toggleDebugMode',
    }),
    toggleFooter() {
      this.footerUnfolded = !this.footerUnfolded
    },
  },
}
</script>
