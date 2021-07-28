<template>
  <transition name="fade">
    <div v-if="showReview" class="review" :style="positionStyles">
      <button class="close-btn close-btn--review" @click="showReview = false">
        x
      </button>
      <div>
        “{{ reviewText }}”
        <span class="review-author">– {{ reviewAuthor }}</span>
      </div>
    </div>
  </transition>
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
    reviewDelay: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isDesktop: false,
      showReview: false,
    }
  },
  computed: {
    positionStyles() {
      const position = {
        top: this.getRandomInt(7, 85) + '%',
        right: this.getRandomInt(0, 70) + '%',
      }

      return this.isDesktop ? position : ''
    },
  },
  mounted() {
    // Set isDesktop when component is mounted
    this.isDesktop = window.innerWidth >= 680 // breakpoint as defined in stylesheets

    // Listen for changes
    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth >= 680
    })

    // Show review after delay
    setTimeout(
      () => (this.showReview = true),
      this.reviewDelay * 1000 // seconds to milliseconds
    )
  },
  methods: {
    getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
  },
}
</script>
