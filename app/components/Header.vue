<template>
  <transition name="fade">
    <header class="header">
      <button class="close-btn close-btn--header" @click="showHeader = false">
        x
      </button>
      <h1>Time Sales Online</h1>
    </header>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showHeader: true,
    }
  },
}
</script>
