<template>
  <div class="purchase">
    <button class="close-btn close-btn--purchase">x</button>
    {{ parsePurchaseText }}
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
      return this.purchaseText
    },
  },
}
</script>
