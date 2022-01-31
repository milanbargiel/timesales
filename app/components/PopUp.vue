<template>
  <transition name="fade">
    <div v-if="showPopUp" class="pop-up" @click="showPopUp = false">
      <button class="close-btn close-btn--pop-up"></button>
      <img class="pop-up-image" :src="popUpImageUrl" alt="Image" />
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    popUpImageUrl: {
      type: String,
      required: true,
    },
    popUpDelay: {
      type: Number,
      required: true,
    },
    popUpTtl: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showPopUp: false,
    }
  },
  mounted() {
    // Show popUp after delay
    const ttl = this.popUpTtl * 1000 // seconds to milliseconds
    const delay = this.popUpDelay * 1000

    setTimeout(() => {
      // Do not trigger Pop-ups, when browser tab is inactive
      if (document.hidden) {
        return
      }
      this.showPopUp = true // show pop up after delay
      setTimeout(() => (this.showPopUp = false), ttl) // kill pop up after ttl
    }, delay)
  },
}
</script>
