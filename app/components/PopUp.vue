<template>
  <div v-if="data.length" class="pop-up">
    <button class="close-btn close-btn--pop-up">x</button>
    <img class="pop-up-image" :src="imageUrl" alt="Placeholder image" />
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
  computed: {
    imageUrl() {
      const baseUrl = this.$config.apiUrl
      let imageUrl = this.data[0].imageUrl

      if (this.data.length > 1) {
        // Select random pop up
        imageUrl =
          this.data[Math.floor(Math.random() * this.data.length)].imageUrl
      }

      return baseUrl + imageUrl
    },
  },
}
</script>
