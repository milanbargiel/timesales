// Import conversation branches
import HoldOn from '../conversation/holdOn.js'
import AmountOfTime from '../conversation/amountOfTime.js'

export default {
  mixins: [HoldOn, AmountOfTime],
  methods: {
    async purposeOfTime() {
      await this.botTextInput('Your answer').then((timePurpose) => {
        this.saveResponse({ timePurpose })
      })

      // Look for predefined keywords in the description of the time needed
      const keyword = this.lookForKeyword(this.response.timePurpose)

      if (keyword) {
        await this.botMessage(`Ah good choice, I like to ${keyword} too.`)
      } else {
        await this.botMessage('Excellent choice')
      }

      // When in short checkout go directly to amount of time dialogue
      // Else, first show hold On dialogue
      if (this.shortCheckout) {
        await this.botMessage('How much time shall it be?')
        this.amountOfTime()
      } else {
        this.holdOn()
      }
    },
  },
}
