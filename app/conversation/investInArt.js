// Import conversation branches
import PurposeOfTime from '../conversation/purposeOfTime.js'
import Exit from '../conversation/exit.js'

export default {
  mixins: [PurposeOfTime, Exit],
  methods: {
    async investInArt() {
      await this.botMessage('No? How do you do that?')

      this.d.timeManagementSecret = await this.botTextInput('Your answer')

      await this.botMessage("Ok, I'll keep that secret safe")

      await this.timeout(7000)

      await this.botMessage(
        'By the way, do you like art? Ever thought about it as an investment?'
      )

      await this.botui.action.button({
        action: [
          {
            text: 'Yes',
          },
          {
            text: 'No',
          },
          {
            text: 'Hmm',
          },
        ],
      })

      await this.botMessage(
        "Many people believe it's good to invest in art because it only increases in value."
      )

      await this.botMessage(
        'I know storage can be pretty challenging. Art pieces require a lot of space, special temperatures, humidity control, costy insurance, and so forth.'
      )

      await this.botui.action.button({
        action: [
          {
            text: 'What do you want to tell me?',
          },
        ],
      })

      await this.botMessage(
        "However,  we've found a smart solution: we invented <i>time</i>, the most volatile piece of all time. It has many advantages: It's lightweight, always available like your files in the cloud, doesn’t take up space, and has no other special needs."
      )

      await this.botMessage('What do you say? Are you ready for an investment?')

      this.d.readyForInvestment = await this.botYesOrNo()

      if (this.d.readyForInvestment.value) {
        // on yes
        await this.botMessage(
          'Good. To make it more unique, we always connect <i>time</i> to a special purpose. What would be the purpose for your <i>time</i>?'
        )

        // Go to checkout dialogue
        this.purposeOfTime()
      } else {
        // on no
        await this.botMessage("Then I can't help you, sorry.")
        this.exit()
      }
    },
  },
}
