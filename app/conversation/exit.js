export default {
  methods: {
    async exit() {
      await this.botMessage(
        'Our paths diverge here, but first I would like to hear your feedback about our service. Do you have any critique, suggestions, comments?'
      )

      await this.botTextInput('Your answer').then((review) => {
        // Save user feedback in the backend
        this.postReview(review)
      })

      await this.botMessage('Thank you for your honesty and trust')

      this.botui.action
        .button({
          action: [
            {
              text: 'Take me back to where it all began',
            },
          ],
        })
        .then(() => {
          // Reloads the component
          this.$router.go()
        })
    },
  },
}
