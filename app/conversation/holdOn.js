// Import conversation branches
import AmountOfTime from '../conversation/amountOfTime.js'

export default {
  mixins: [AmountOfTime],
  methods: {
    async holdOn() {
      await this.botMessage(
        'Hold on, I have a premium customer on the other line...'
      )

      await this.timeout(10000)

      await this.botMessage('Where were we? You wanted to buy some time right?')
      await this.botMessage('How much is it going to be?')

      // Go to amount of time dialogue
      this.amountOfTime()
    },
  },
}
