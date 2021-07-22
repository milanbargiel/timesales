<template>
  <div class="purchase">
    <button class="close-btn close-btn--purchase">x</button>
    <!-- Paste parsed HTML content -->
    <span v-html="parsePurchaseText"></span>
  </div>
</template>

<script>
export default {
  props: {
    purchaseText: {
      type: String,
      required: true,
    },
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
}
</script>
