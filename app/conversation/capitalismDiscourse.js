/* eslint-disable no-prototype-builtins */
// Import conversation branches
import PurposeOfTime from '../conversation/purposeOfTime.js'

export default {
  mixins: [PurposeOfTime],
  methods: {
    async capitalismDiscourse() {
      await this.botMessage('Why?')

      // When user does not answer question afters 20 secs proceed to becauseOfCapitalism dialogue
      const question = this.timeout(20000, this.botTextInput('Your answer'))

      await question.then(async (response) => {
        // If response was given perform AI comment otherwise ask if capitalism is the reason
        if (response) {
          await this.reasonShortOnTime(response)
        } else {
          await this.becauseOfCapitalism()
        }
      })

      await this.botMessage('What would you like to have time for?')

      // Proceed with checkout
      this.purposeOfTime()
    },
    async reasonShortOnTime(response) {
      // botAiComment takes three parameters
      // userInput, fieldName and nextBotMessage
      await this.botAiComment(
        response,
        'reasonShortOnTime',
        'Well, I think I can help you improve your time management'
      )

      await this.botMessage(
        "What would you say if we give more value to the things you'd like to do?"
      )

      await this.customCraftedTimeDigression()
    },
    async becauseOfCapitalism() {
      await this.botMessage('Is it because of capitalism?')

      await this.botYesOrNo().then((becauseOfCapitalism) => {
        this.saveResponse({ becauseOfCapitalism })
      })

      if (this.response.becauseOfCapitalism) {
        await this.botMessage(
          "Is it really that simple? Ok, well then let's beat capitalism with its own weapons. I'll sell you some time so you can escape the hamster wheel of artificial scarcity and harmful competition"
        )
      } else {
        await this.botMessage(
          "Correct, it would be too easy to blame capitalism for all our problems. It's because of your own time management. Maybe I can help you to improve it! What would you say if we give more value to the things you'd like to do?"
        )

        await this.customCraftedTimeDigression()
      }
    },
    async customCraftedTimeDigression() {
      await this.botMessage(
        "You tell me what you would like to do and I'll sell you some time custom crafted for that purpose. That will give you just the right amount of pressure to use that time for it's intended purpose. You don't want to lose both money and time, right?"
      )

      await this.botMessage("So let's get to it!")
    },
  },
}
