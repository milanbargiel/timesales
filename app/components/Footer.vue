<template>
  <div v-if="showFooter" class="footer-container">
    <footer v-if="footerUnfolded" class="footer">
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
          href="https://soundcloud.com/biomigrant"
          target="_blank"
          >Biomigrant</a
        >
        <a class="link link--underlined">Layla Ansari</a>
      </div>
      <div class="navigation">
        <NuxtLink class="link link--undecorated" to="/">Buy time</NuxtLink>
        <NuxtLink
          v-for="link in links"
          :key="link.slug"
          class="link link--undecorated"
          :to="link.slug"
          >{{ link.title }}</NuxtLink
        >
        <div class="footer-branding">
          World leaders in the time business since 2018.
        </div>
      </div>
      <div class="patrons">
        <SvgsKulturNrw />
        <SvgsLabK />
        <SvgsBergLawyers />
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
    // In sand simulation on the order page the footer is hidden
    showFooter() {
      return this.$store.state.ui.showFooter
    },
  },
  methods: {
    ...mapMutations({
      showHeader: 'ui/showHeader', // Enables this.showHeader()
    }),
    toggleFooter() {
      // Show the Time Sales Online header when the footer unfolds
      if (!this.$store.state.ui.showHeader && !this.footerUnfolded) {
        this.showHeader()
      }

      // Toogle the footer
      this.footerUnfolded = !this.footerUnfolded
    },
  },
}
</script>
