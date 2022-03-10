/* eslint-disable no-prototype-builtins */
// Import conversation branches
import PurposeOfTime from '../conversation/purposeOfTime.js'

export default {
  mixins: [PurposeOfTime],
  methods: {
    async capitalismDiscourse() {
      await this.botMessage('Why?')

      await this.botTextInput('Your answer').then(async (response) => {
        // botAiComment takes three parameters
        // userInput, fieldName and nextBotMessage
        await this.botAiComment(
          response,
          'reasonShortOnTime',
          'Well, I think I can help you improve your time management'
        )
      })

      await this.botYesOrNo().then((becauseOfCapitalism) => {
        this.saveResponse({ becauseOfCapitalism })
      })

      if (this.response.becauseOfCapitalism) {
        await this.botMessage(
          "Is It really that simple? Ok, well then, let's beat capitalism with its own weapons. I'll sell you some time so you escape the hamster wheel of artificial scarcity and harmful competition."
        )
      } else {
        await this.botMessage(
          "Correct, it would be too easy to blame capitalism for all our problems. It's because of your own time management. Maybe I can help you to improve it! What would you say if we give more value to the things you'd like to do?"
        )

        await this.botMessage(
          "You tell me what you would like to do and I'll sell you some time custom crafted for that purpose. That will give you just the right amount of pressure to use that time for it's intended purpose. You don't want to lose both money and time, right?"
        )

        await this.botMessage("So let's get to it!")
      }

      await this.botMessage('What would you like to have time for?')

      // Proceed with checkout
      this.purposeOfTime()
    },
  },
}
