<template>
  <div class="container">
    <div>
      <div id="botui">
        <bot-ui />
      </div>
    </div>
  </div>
</template>

<script>
import vue from 'vue'
import Botui from 'botui'

export default {
  data() {
    return {
      botui: '',
    }
  },
  async mounted() {
    await this.$nextTick()
    this.botui = new Botui('botui', { vue })
    this.startBot()
  },
  methods: {
    startBot() {
      this.botui.message.add({
        content: 'Hello from bot.',
      })
      this.botui.message.add({
        human: true,
        content: 'Hello from human.',
      })
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
