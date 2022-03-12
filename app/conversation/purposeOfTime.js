// Import conversation branches
import HoldOn from '../conversation/holdOn.js'
import AmountOfTime from '../conversation/amountOfTime.js'

export default {
  mixins: [HoldOn, AmountOfTime],
  methods: {
    async purposeOfTime() {
      await this.botTextInput('Your answer').then(async (response) => {
        await this.botAiComment(response, 'timePurpose')
      })

      // Show hold On dialogue
      // When in short checkout go directly to amount of time dialogue
      if (!this.shortCheckout) {
        this.holdOn()
      } else {
        await this.botMessage('How much time shall it be?')
        this.amountOfTime()
      }
    },
  },
}
