<template>
  <footer class="footer">
    <div class="navigation">
      <a href="#">Imprint</a>
      <a href="#">Data privacy</a>
      <a href="#">Terms and conditions</a>
      <span class="debug-link" @click="shortCheckout">Short Checkout</span>
      <div class="debug-toggle">
        <label class="switch">
          <input v-model="debugMode" type="checkbox" @click="toggleDebugMode" />
          <div></div>
        </label>
        Fast conversation
      </div>
    </div>
    <div class="creators">
      <a class="underlined-link" href="#">Milan Bargiel</a>
      <a class="underlined-link" href="#">Ludwig Lederer</a>
      <a class="underlined-link" href="#">Katherina Gorodynska</a>
      <img
        class="patron-logo"
        src="~/assets/lab-k-nrw.svg"
        alt="Landesbüro für Bildende Kunst (LaB K)"
      />
    </div>
  </footer>
</template>

<script>
import { mapMutations } from 'vuex' // helper for mapping vuex store mutations to methods

export default {
  computed: {
    debugMode() {
      return this.$store.state.debugMode
    },
  },
  methods: {
    ...mapMutations({
      // Enables this.toggleDebugMode()
      toggleDebugMode: 'toggleDebugMode',
    }),
    shortCheckout() {
      this.$router.go({ path: '/', query: { shortCheckout: true } })
    },
  },
}
</script>
