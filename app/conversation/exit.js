export default {
  methods: {
    async exit() {
      await this.botMessage(
        'Our paths diverge here, but first I would like to hear your feedback about our service. Do you have any critique, suggestions, comments?'
      )

      await this.botTextInput('Your answer').then(async (review) => {
        // Save user feedback in the backend
        // The corresponding vuex action is defined in store/advertisement.js
        this.postReview(review)

        // Generate aiComment
        await this.botAiComment(review, 'reviewComment')
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
