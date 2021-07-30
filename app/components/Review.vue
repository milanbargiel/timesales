<template>
  <transition name="fade">
    <div v-if="showReview" class="review" :style="{ top, right }">
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
      top: 0,
      right: 0,
      showReview: false,
    }
  },
  mounted() {
    // Show review after delay
    setTimeout(
      () => {
        this.setRandomPosition()
        this.showReview = true
      },
      this.reviewDelay * 1000 // seconds to milliseconds
    )
  },
  methods: {
    getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    setRandomPosition() {
      // only desktop
      if (window.innerWidth > 800) {
        // Top value between scroll position and window height - offset
        this.top =
          this.getRandomInt(window.pageYOffset, window.innerHeight - 200) + 'px'
        // Right value is randomly choosen from 0 - 15 / 60 - 75 percent
        // 15 - 60 is a dead zone
        const right =
          Math.random() < 0.5
            ? this.getRandomInt(0, 15)
            : this.getRandomInt(60, 75)
        this.right = right + '%'
      }
    },
  },
}
</script>
