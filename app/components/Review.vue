<template>
  <div class="review">
    <button class="close-btn close-btn--review">x</button>
    “{{ reviewText }}” <span class="review-author">– {{ reviewAuthor }}</span>
  </div>
</template>

<script>
export default {
  props: {
    reviewText: {
      type: String,
      required: true,
    },
    reviewAuthor: {
      type: String,
      required: true,
    },
  },
}
</script>
