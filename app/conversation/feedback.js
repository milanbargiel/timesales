export default {
  methods: {
    async feedback() {
      // Do a feedback introduction if the user does not come directly from the sandstream
      if (!(this.order && this.order.progress === 0)) {
        await this.botMessage(
          'What do you think about our products and our service? Did you like it? Please leave your critique, suggestions, remarks'
        )
      }

      await this.botTextInput('Your answer').then((review) => {
        // Save user feedback in the backend
        this.postReview(review)
      })

      await this.botMessageHtml('Would you like to have some more <i>time</i>?')

      const response = await this.botYesOrNo()

      if (response === true) {
        this.timeout(2000)
        // Go to checkout short checkout flow on index page
        this.$router.push('/?shortCheckout')
      } else {
        await this.botMessage('Alright. See you another time then. Goodbye')
      }
    },
  },
}
