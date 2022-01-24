import timestring from 'timestring' // to convert time
import pos from 'pos' // English speech tagger

// Import conversation branches
import Exit from '../conversation/exit.js'

// Import word-prepositions list
import wordsArray from '../static/word-prepositions.json'

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
      // Convert time
      const timeString = this.humanizeTime(
        this.response.timeAmount,
        this.response.timeUnit
      )

      // Convert time purpose to lower case for case insensitive searches
      let text = timePurpose.toLowerCase()

      // Replace personal pronouns
      text = text.replace(/\b(my)\b/i, 'your')
      text = text.replace(/\b(myself)\b/i, 'yourself')
      text = text.replace(/\b(you)\b/i, 'the Time Sales bot')
      text = text.replace(/\b(i)\b/i, 'you')

      const firstWord = text.split(' ')[0]

      let wordIsNoun
      let wordOnList

      // 1. Input consists of only one word
      if (text.split(' ').length === 1) {
        // Check wether word is on word-prepositions list
        wordOnList = wordsArray.find((object) => object.word === firstWord)

        if (wordOnList) {
          return `${timeString} ${wordOnList.preposition} ${wordOnList.word}`
        }

        // If nothing was found check wether firstWord is a noun
        const tagger = new pos.Tagger()
        const word = new pos.Lexer().lex(firstWord)
        const tag = tagger.tag(word)[0][1]

        // word is a noun
        wordIsNoun = tag.includes('NN')
      }

      // 2. Check if Text begins the indefine article "a" or "an" "the"
      // Or with the possesive pronouns "your", "his", "her", "their"
      // Or there is only one word and it is a noun
      const startsWithIndefiniteArticle =
        firstWord === 'a' || firstWord === 'an'

      const startsWithThe = firstWord === 'the'

      // Iterate over possessive pronouns and return true if one value meets the criteria
      const startsWithPossessivePronoun = ['your', 'his', 'her', 'their'].some(
        (word) => firstWord === word
      )

      if (
        startsWithIndefiniteArticle ||
        startsWithThe ||
        startsWithPossessivePronoun ||
        wordIsNoun
      ) {
        return `${timeString} for ${
          // First letter sentence in lower case
          text.charAt(0).toLowerCase() + text.slice(1)
        }`
      }

      // 3. Text contains the prepositions 'to', 'not to', or 'for'
      const prepositions = [
        text.indexOf('to'),
        text.indexOf('not to'),
        text.indexOf('for'),
      ].filter((val) => val > -1) // Only consider indexes from text (index > -1 )

      if (prepositions.length) {
        // Get the index of the first preposition (if there is more than one)
        const prepositionIndex = Math.min(...prepositions)

        // Return [timeAmount] [timeUnit] + preposition + everything after preposition
        return `${timeString} ${text.substring(prepositionIndex, text.length)}`
      }

      // 4. Text contains no prepositions but a verb in gerundium form 'ing'
      if (text.includes('ing')) {
        // Find the index of the word with ing
        let wordIndex = text.slice(0, text.indexOf('ing') + 3).search(/\S+$/)

        // Check wether there is a "not" directly before the word and if so include it in the summarization
        const containsNot =
          wordIndex >= 4 && text.slice(wordIndex - 4, wordIndex - 1) === 'not'
        wordIndex = containsNot ? wordIndex - 4 : wordIndex

        return `${timeString} for ${text.substring(wordIndex, text.length)}`
      }

      // 5. Neither a preposition nor a gerundium
      // First letter of timePurpose in lower case
      return `${timeString} to ${text.charAt(0).toLowerCase() + text.slice(1)}`
    },
    async priceInput(timeout1, timeout2) {
      this.showTaxInfo = true // Text: Keep in mind that 7% VAT will be added on checkout.

      await this.botui.action
        .text({
          addMessage: false, // Use a custom response instead
          action: {
            sub_type: 'number',
            placeholder: 'Worth in €',
          },
        })
        .then(async (res) => {
          const price = parseInt(res.value)
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
            this.showTaxInfo = false
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
        const timePriceInEuro = this.response.timePrice / 100

        let tax = Math.round(timePriceInEuro * 0.07 * 100) / 100 // 7% tax rounded to decimals

        // Convert to EUR currency String with always to decimals
        tax = tax.toLocaleString('de-DE', {
          style: 'currency',
          currency: 'EUR',
        })

        // Show price calculation with taxes as human input
        await this.botui.message.add({
          delay: 10,
          human: true,
          content: `${timePriceInEuro} + ${tax} taxes`,
        })

        const time = `${this.response.timeAmount} ${this.response.timeUnit}`
        const timeInMinutes = timestring(time, 'm')
        const timeQuotient = timeInMinutes / timePriceInEuro

        if (timeQuotient <= 1) {
          await this.botMessage(
            'Very good, this will be some real quality time.'
          )
        } else if (timeQuotient > 1 && timeQuotient < 30) {
          await this.botMessage("That's a reasonable price!")
        } else {
          await this.botMessage(
            'Well, at that price I am not sure you will have a good time.'
          )
        }

        this.showCheckoutButton = true

        // Wait for next DOM rendering cycle so that checkout button is already rendered
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
  },
}
