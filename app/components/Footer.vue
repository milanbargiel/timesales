<template>
  <footer v-if="showFooter" class="footer">
    <div class="navigation">
      <a href="#">Imprint</a>
      <a href="#">Data privacy</a>
      <a href="#">Terms and conditions</a>
    </div>
    <div class="creators">
      <div class="people">
        <a class="underlined-link" href="#">Milan Bargiel</a>
        <a class="underlined-link" href="#">Ludwig Lederer</a>
        <a class="underlined-link" href="#">Katherina Gorodynska</a>
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
    </div>
  </footer>
</template>

<script>
import { mapMutations } from 'vuex' // helper for mapping vuex store mutations to methods

export default {
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
  },
}
</script>
