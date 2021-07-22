<template>
  <div class="purchase-ticker">
    <Purchase
      v-for="(purchase, index) in data"
      :key="`purchase-${index}`"
      :purchase-text="purchase.text"
    />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
}
</script>
