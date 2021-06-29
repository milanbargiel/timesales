// Import conversation branches
import holdOn from '../conversation/holdOn.js'

export default {
  mixins: [holdOn],
  methods: {
    async purposeOfTime() {
      await this.botTextInput('Your answer').then((timePurpose) => {
        this.setResponse({ timePurpose })
      })

      // Look for predefined keywords in the description of the time needed
      const keyword = this.lookForKeyword(this.response.timePurpose)

      if (keyword) {
        await this.botMessage(`Ah good choice, I like to ${keyword} too.`)
      } else {
        await this.botMessage('Excellent choice')
      }

      // Go to hold on dialogue
      this.holdOn()
    },
  },
}
