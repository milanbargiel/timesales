// This conversation is triggered when the user cancels the payment in Stripe
// Import conversation branches
import Exit from '../conversation/exit.js'

export default {
  mixins: [Exit],
  methods: {
    async cancelConversation() {
      await this.botMessage('No time for you today?')
      await this.botui.action
        .button({
          action: [
            {
              text: 'No, thank you',
              value: false,
            },
            {
              text: 'I want to change my order',
              value: true,
            },
          ],
        })
        .then((changeOrder) => {
          if (changeOrder.value) {
            // Go to checkout short checkout flow on index page
            this.$router.push('/?shortCheckout')
          } else {
            // Start exit dialogue
            this.exit()
          }
        })
    },
  },
}
