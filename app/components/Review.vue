<template>
  <div class="review" :style="positionStyles">
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
  data() {
    return { windowWidth: null }
  },
  computed: {
    isDesktop() {
      return this.windowWidth >= 680 // breakpoint as defined in stylesheets
    },
    positionStyles() {
      const position = {
        top: this.getRandomInt(0, 70) + '%',
        right: this.getRandomInt(0, 80) + '%',
      }

      return this.isDesktop ? position : ''
    },
  },
  mounted() {
    // Set windowWidth when component is mounted
    this.windowWidth = window.innerWidth

    // Listen for changes
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    })
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
