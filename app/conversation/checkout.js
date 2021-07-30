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
    // Function to generate a string that sums up the purpose and amount of time
    createOrderSummary(timePurpose, timeAmount, timeUnit) {
      // Convert time purpose to lower case for case insensitive searches
      const text = timePurpose.toLowerCase()

      // Search for to 'to', 'for' and 'ing'
      const containsTo = text.includes('to')
      const containsFor = text.includes('for')
      const containsIng = text.includes('ing')

      // Convert time
      const timeString = this.humanizeTime(
        this.response.timeAmount,
        this.response.timeUnit
      )

      // 1. Text contains the prepositions 'to' or 'for'
      let preposition

      if (containsTo || containsFor) {
        // If both preposition exist, take the first one in the sentence
        if (containsTo && containsFor) {
          preposition = text.indexOf('to') < text.indexOf('for') ? 'to' : 'for'
        } else {
          preposition = containsTo ? 'to' : 'for'
        }
      }

      if (preposition) {
        // Return [timeAmount] [timeUnit] + to / for + everything after preposition
        return `${timeString} ${timePurpose.substring(
          text.indexOf(preposition),
          text.length
        )}`
      }

      // 2. Text contains no prepositions but a verb in gerundium form 'ing'
      if (containsIng) {
        // Find the index of the word with ing
        const wordIndex = text.slice(0, text.indexOf('ing') + 3).search(/\S+$/)
        // Include everything from the word with 'ing' to the end
        return `${timeString} for ${timePurpose.substring(
          wordIndex,
          text.length
        )}`
      }

      // 3. Neither a preposition nor a gerundium
      // First letter of timePurpose in lower case
      return `${timeString} to ${
        timePurpose.charAt(0).toLowerCase() + timePurpose.slice(1)
      }`
    },
    async priceInput(timeout1, timeout2) {
      await this.botNumberInput('Worth in €').then(async (price) => {
        // Do not show pushy questions anymore when price is given
        this.hidePushyQuestion()
        clearTimeout(timeout1)
        clearTimeout(timeout2)

        // Validate input
        // Stripe allows transfers of 10000€ max
        // With 7% VAT 9300€ is the maximum input for users
        if (price <= 0 || price > 9300) {
          // Limit is set by Stripe
          await this.botMessage(
            'Your inquiry qualifies for premium customer service, please contact us via email or choose a smaller price to continue.'
          )
          await this.priceInput() // recursion
        } else {
          this.saveResponse({ timePrice: price * 100 }) // convert input to cents
        }
      })
    },
    async checkout() {
      // Create order summary
      const orderSummary = this.createOrderSummary(
        this.response.timePurpose,
        this.response.timeAmount,
        this.response.timePurpose
      )

      // Save it in DB
      this.saveResponse({ orderSummary }) // convert input to cents

      await this.botMessage(
        `${orderSummary}. What would that time be worth to you?`
      )

      await this.botMessage(
        'Keep in mind that 7% VAT will be added on checkout.'
      )

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
        this.showCheckoutButton = true
      }
    },
  },
}
