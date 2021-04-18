<template>
  <div class="container">
    <div id="botui">
      <bot-ui />
    </div>
  </div>
</template>

<script>
import Cancel from '../../conversation/cancel.js'

export default {
  mixins: [Cancel],
  data() {
    return { botui: '' }
  },
  async mounted() {
    // load bot modules
    await this.$nextTick()
    this.botui = this.$botui('botui')
    this.cancel()
  },
}
</script>
