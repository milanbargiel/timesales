<template>
  <svg
    width="38"
    height="26"
    viewBox="0 0 38 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :transform="rotation"
  >
    <path d="M19 0L37.1865 25.5H0.813467L19 0Z" fill="black" />
  </svg>
</template>

<script>
export default {
  props: {
    unfolded: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    rotation() {
      return this.unfolded ? 'rotate(180)' : ''
    },
  },
}
</script>
