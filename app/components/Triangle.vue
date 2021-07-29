<template>
  <div>
    <svg
      v-if="unfolded"
      width="38"
      height="26"
      viewBox="0 0 38 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 26L0.813469 0.5L37.1865 0.5L19 26Z" fill="black" />
    </svg>
    <svg
      v-else
      width="38"
      height="26"
      viewBox="0 0 38 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 0L37.1865 25.5H0.813467L19 0Z" fill="black" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    unfolded: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
