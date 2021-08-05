<template>
  <transition name="fade">
    <header v-if="showHeader" class="header">
      <button class="close-btn close-btn--header" @click="hideHeader">×</button>
      <h1 class="header-title">Time Sales Online</h1>
    </header>
  </transition>
</template>

<script>
import { mapMutations } from 'vuex' // helper for mapping vuex store mutations to methods

export default {
  computed: {
    showHeader() {
      return this.$store.state.ui.showHeader
    },
  },
  methods: {
    ...mapMutations({
      // Enables this.hideHeader()
      hideHeader: 'ui/hideHeader',
    }),
  },
}
</script>
