<template>
  <div v-if="showPopUp" class="pop-up">
    <button class="close-btn close-btn--pop-up">x</button>
    <img class="pop-up-image" :src="popUpImageUrl" alt="Image" />
  </div>
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
  },
  data() {
    return {
      showPopUp: false,
    }
  },
  mounted() {
    // Show popUp after delay
    setTimeout(
      () => (this.showPopUp = true),
      this.popUpDelay * 1000 // seconds to milliseconds
    )
  },
}
</script>
