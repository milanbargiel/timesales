// Import conversation branches
import PurposeOfTime from '../conversation/purposeOfTime.js'
import IsItGod from '../conversation/isItGod.js'

export default {
  mixins: [PurposeOfTime, IsItGod],
  methods: {
    async investInArt() {
      await this.botMessage('No? How do you do that?')

      await this.botTextInput('Your answer').then(async (response) => {
        await this.botAiComment(response, 'timeManagementSecret')
      })

      await this.timeout(7000)

      await this.botMessage(
        'By the way, do you like art? Ever thought about it as an investment?'
      )

      // botAiComment takes three parameters
      // userInput, fieldName and nextBotMessage
      await this.botTextInput('Your answer').then(async (response) => {
        await this.botAiComment(
          response,
          'artAsInvestment',
          "Many people believe it's good to invest in art because it only increases in value"
        )
      })

      await this.botMessage(
        'I know storage can be pretty challenging. Art pieces require a lot of space, special temperatures, humidity control, costly insurance, and so forth'
      )

      await this.botui.action.button({
        action: [
          {
            text: 'What do you want to tell me?',
          },
        ],
      })

      await this.botMessageHtml(
        "However, we've found a smart solution: we invented <i>time</i>, the most volatile piece of all time. It has many advantages: It's lightweight, always available like your files in the cloud, doesn't take up space, and has no other special needs"
      )

      await this.botMessage('What do you say? Are you ready for an investment?')

      await this.botYesOrNo().then((readyForInvestment) => {
        this.saveResponse({ readyForInvestment })
      })

      if (this.response.readyForInvestment) {
        // on yes
        await this.botMessageHtml(
          'Good. To make it more unique, we always connect <i>time</i> to a special purpose. What would be the purpose for your <i>time?</i>'
        )

        // Go to checkout dialogue
        this.purposeOfTime()
      } else {
        // Go to isItGod dialogue
        this.isItGod()
      }
    },
  },
}
