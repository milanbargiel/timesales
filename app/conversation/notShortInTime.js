export default {
  methods: {
    async notShortInTime() {
      await this.botMessage('No? How do you do that?')

      await this.botui.action.text({
        action: {
          placeholder: 'Your answer',
        },
      })

      await this.botMessage("Ok, i'll keep that secret save")

      await this.timeout(7000)

      await this.botMessage('By the Way do you like art?')

      await this.botMessage(
        'Many people believe in art as a good investment because it can only increase invalue.'
      )

      await this.botMessage(
        "but we've found a smart solution: we invented <i>time</i> the most volatile piece of all time."
      )

      await this.botMessage(
        "It offers lots of advantages: It's leightweight, always available like your files in the cloud, does not occupy any space, no other special needs."
      )

      await this.botMessage('what do you say? are you ready for an investment?')

      const response = await this.botYesOrNo()

      if (response.value) {
        // on yes
        await this.botMessage(
          'Good. To make it more unique, we always connect <i>time</i> to a special purpose. What would be the Purpose for your <i>Time</i>?'
        )

        this.order.description = await this.botTextInput('Your answer')

        // When user enters a description, proceed to checkout conversation
        if (this.order.description) {
          this.checkoutConversation()
        }
      } else {
        // on no
        await this.botMessage('Then i cannot help you either')
        this.exitConversation()
      }
    },
  },
}
