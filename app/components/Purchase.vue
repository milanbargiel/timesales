<template>
  <transition name="fade">
    <div v-if="showPurchase" class="purchase" @click="showPurchase = false">
      <button class="close-btn close-btn--purchase"></button>
      <!-- Paste parsed HTML content -->
      <!-- eslint-disable vue/no-v-html -->
      <span v-html="parsePurchaseText"></span>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    purchaseText: {
      type: String,
      required: true,
    },
    purchaseDelay: {
      type: Number,
      required: true,
    },
    purchaseTtl: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showPurchase: false,
    }
  },
  computed: {
    parsePurchaseText() {
      // Replace '*' with span html tag
      const html = this.purchaseText.replace(
        /\*([^*]+?)\*/g,
        '<span class="special-font">$1</span>'
      )
      return html
    },
  },
  mounted() {
    const ttl = this.purchaseTtl * 1000 // seconds to milliseconds
    const delay = this.purchaseDelay * 1000

    setTimeout(() => {
      // Do not trigger Pop-ups, when browser tab is inactive
      if (this.$store.state.advertisement.pageVisible === false) {
        return
      }
      this.showPurchase = true // show pop up after delay
      setTimeout(() => (this.showPurchase = false), ttl) // kill pop up after ttl
    }, delay)
  },
}
</script>
