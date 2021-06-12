// Import conversation branches
import Exit from '../conversation/exit.js'

export default {
  mixins: [Exit],
  methods: {
    async inControl() {
      await this.botMessage(
        'You seem to be yery much in control over your life. Would you like to work for us'
      )

      this.d.workForTSO = await this.botYesOrNo()

      if (this.d.workForTSO.value === true) {
        await this.botMessage(
          `${this.d.name}, please enter your e-mail adress here, so we can get in touch with you`
        )

        this.d.email = await this.botTextInput('Your email')

        await this.botMessage('You will hear from us')
      } else {
        await this.botMessage('Our paths diverge here')
        await this.botMessage('Have a good time anways')

        // Go to exit dialogue
        this.exit()
      }
    },
  },
}
