<template>
  <div v-if="showFooter" class="footer-container">
    <footer v-if="footerUnfolded" class="footer">
      <div></div>
      <div class="creators">
        <div class="creators-header">Partners:</div>
        <a class="link link--underlined" href="#">Milan Bargiel</a>
        <a class="link link--underlined" href="#">Jim-Fx</a>
        <a class="link link--underlined" href="#">Katherina Gorodynska</a>
        <a class="link link--underlined" href="#">Ludwig Lederer</a>
        <a class="link link--underlined" href="#">Biomigrant</a>
      </div>
      <div class="navigation">
        <a class="link" href="#">Imprint</a>
        <a class="link" href="#">Data privacy</a>
        <a class="link" href="#">Terms and conditions</a>
      </div>
      <div class="patrons">
        <img
          class="patron-logo"
          src="~/assets/lab-k-nrw.svg"
          alt="Landesbüro für Bildende Kunst (LaB K)"
        />
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
    }
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
