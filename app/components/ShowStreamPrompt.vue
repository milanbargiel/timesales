<template>
  <div class="bot-container">
    <div id="botui">
      <bot-ui />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowStreamPrompt',
  data() {
    return {
      botui: '',
    }
  },
  async mounted() {
    // load bot modules
    await this.$nextTick()
    this.botui = this.$botui('botui')
    this.startConversation()
  },
  methods: {
    async startConversation() {
      await this.botMessage('Thank you for your order!')

      await this.botMessage('Do you want to use your Time right now?')

      const showStream = await this.botui.action.button({
        action: [
          {
            text: 'Yes, take me to the time stream',
            value: true,
          },
          {
            text: 'I want to use it later',
            value: false,
          },
        ],
      })

      if (showStream.value) {
        await this.botMessage('Okay, then follow me.')

        await this.botMessage(
          "Don't worry, you can pause your stream whenever you feel like it."
        )

        await this.timeout(5000)

        // Emit answer to parent to start Time stream
        this.$emit('show-stream', showStream.value)
      } else {
        await this.botMessage('Of course, as you wish.')
        await this.botMessage(
          'When you decide to use your Time, just follow the link from the E-Mail that I have send to you.'
        )
      }
    },
  },
}
</script>
