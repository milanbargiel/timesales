// This conversation is triggered when the user cancels the payment in Stripe
// Import conversation branches
import Exit from '../conversation/exit.js'

export default {
  mixins: [Exit],
  methods: {
    async cancelConversation() {
      await this.botMessageHtml('No <i>time</i> for you today?')
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
            // Use window history workaround
            // https://stackoverflow.com/questions/66317718/nuxtjs-change-query-params-and-reload-page
            window.history.pushState({}, '', '/?shortCheckout')
            // Reload page
            window.location.reload()
          } else {
            // Start exit dialogue
            this.exit()
          }
        })
    },
  },
}
