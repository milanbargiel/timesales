<template>
  <div>
    <PopUp
      v-for="(popUp, index) in data"
      :key="`popUp-${index}`"
      :pop-up-image-url="imageUrl(index)"
      :pop-up-delay="popUp.delay"
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
  methods: {
    imageUrl(index) {
      const baseUrl = this.$config.apiUrl
      return baseUrl + this.data[index].imageUrl
    },
  },
}
</script>
