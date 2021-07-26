<template>
  <div class="review-container">
    <!-- Iterate over data array and pass fields to review component -->
    <Review
      v-for="(review, index) in data"
      :key="`review-${index}`"
      :review-text="review.text"
      :review-author="review.author"
      :delay="review.delay"
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
