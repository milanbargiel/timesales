// Import conversation branches
import Exit from '../conversation/exit.js'

export default {
  mixins: [Exit],
  methods: {
    humanizeTime(timeAmount, timeUnit) {
      // Singularize timeunit when 1 e.g second(s)
      return `${timeAmount} ${
        timeAmount === 1 ? timeUnit.slice(0, -1) : timeUnit
      }`
    },
    async priceInput(timeout1, timeout2) {
      await this.botNumberInput('Worth in €').then(async (price) => {
        // Do not show pushy questions anymore when price is given
        this.hidePushyQuestion()
        clearTimeout(timeout1)
        clearTimeout(timeout2)

        // Validate input
        if (price <= 0 || price > 999999999999) {
          // Limit is set by Stripe
          await this.botMessage(
            'Your input is not valid. Please choose a more appropriate price.'
          )
          await this.priceInput() // recursion
        } else {
          this.saveResponse({ timePrice: price * 100 }) // convert input to cents
        }
      })
    },
    async checkout() {
      await this.botMessage('What would that time be worth to you?')

      await (async () => {
        // Show message after 10 sec if user does not enter a value
        const t1 = setTimeout(async () => {
          await this.botMessageHtml(
            'Some people base their decisions on their hourly income, others choose a more idealistic approximation. I always ask myself <i>what amount of money would hurt a little bit?</i> That should be enough to make your time precious to you.'
          )
        }, 10000)

        // After 25 sec show another prompt
        const t2 = setTimeout(async () => {
          await this.botMessageHtml(
            "Ultimately you'll have to ask yourself: <i>What am I willing to spend? What's appropriate and won't ruin me?</i>"
          )
        }, 25000)

        // Ask for price in input field with basic validation
        // Pass timeouts to function to cancel them, when user sets the price
        await this.priceInput(t1, t2)
      })()

      // Only continue when user enters value
      if (this.response.timePrice) {
        await this.botMessage(
          `Sweet! You chose to buy ${this.humanizeTime(
            this.response.timeAmount,
            this.response.timeUnit
          )} of time to ${this.response.timePurpose} for ${
            this.response.timePrice / 100
          } €. Do you want to proceed to checkout?`
        )

        this.showCheckoutButton = true
      }
    },
  },
}
