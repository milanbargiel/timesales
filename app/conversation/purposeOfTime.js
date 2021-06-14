// Import conversation branches
import AmountOfTime from '../conversation/amountOfTime.js'

export default {
  mixins: [AmountOfTime],
  methods: {
    async purposeOfTime() {
      await this.botTextInput('Your answer').then((timeType) => {
        this.setResponse({ timeType })
      })

      // Look for predefined keywords in the description of the time needed
      const keyword = this.lookForKeyword(this.response.timeType)

      if (keyword) {
        await this.botMessage(`Ah good choice, I like to ${keyword} too.`)
      } else {
        await this.botMessage('Excellent choice')
      }

      // Go to amount of time dialogue
      this.amountOfTime()
    },
  },
}
