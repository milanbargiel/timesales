export default {
  methods: {
    async moreTime() {
      await this.botMessageHtml('Do you want to have some more <i>time</i>?')
      const response = await this.botYesOrNo()
      if (response === true) {
        this.timeout(2000)
        // Go to checkout short checkout flow on index page
        this.$router.push('/?shortCheckout')
      } else {
        await this.botMessage('Alright. See you another time then.')
      }
    },
    async feedback() {
      await this.botMessage('Did you enjoy your time?')

      await this.botMessage(
        'Leave your thoughts, remarks, critique. (We reserve the rights to use them anonymised)'
      )

      const feedback = await (() => {
        // Pushy question when user does not starts typing within 20 seconds
        const t = setTimeout(async () => {
          const textInput = this.$el.querySelector('.botui-actions-text-input')

          // If no input was given, hide input field and continue dialogue
          if (!textInput.value) {
            textInput.hidden = true
            await this.moreTime()
          }
        }, 20000)

        // Ask for feedback
        return this.botTextInput('Your feedback').then((response) => {
          // Do not show pushy questions anymore when feedback is given
          clearTimeout(t)
          return response
        })
      })()

      // Ask, if the user wants to buy more time
      // Save feedback TODO: Request to actually save the feedback in the database
      if (feedback) {
        await this.moreTime()
      }
    },
  },
}