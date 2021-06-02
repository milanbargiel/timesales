<template>
  <div class="bot-container">
    <div id="botui">
      <bot-ui />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Feedback',
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
      await this.botMessage('Did you enjoy your time?')

      await this.botMessage(
        'Leave your thoughts, remarks, critique. (We reserve the rights to use them anonymised)'
      )

      // Save feedback TODO: Request to actually save the feedback in the database
      this.botTextInput('Your feedback')

      await this.timeout(7000)

      await this.botMessage('Do you want to have some more <i>time</i>?)')

      const response = await this.botYesOrNo()

      if (response.value === true) {
        // Go to checkout flow on index page
        this.$router.push('/')
      }
    },
  },
}
</script>
