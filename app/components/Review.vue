<template>
  <div class="review">
    <button class="close-btn close-btn--review">x</button>
    {{ reviewText }}
  </div>
</template>

<script>
export default {
  props: {
    reviewText: {
      type: String,
      required: true,
    },
  },
}
</script>
