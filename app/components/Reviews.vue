<template>
  <div class="review-container">
    <!-- Iterate over data array and pass fields to review component -->
    <Review
      v-for="(text, author, index) in data"
      :key="`review-${index}`"
      :review-text="text"
      :review-author="author"
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
