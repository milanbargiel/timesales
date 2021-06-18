// Import conversation branches
import Exit from '../conversation/exit.js'

export default {
  mixins: [Exit],
  methods: {
    async inControl() {
      await this.botMessage(
        'You seem to be yery much in control over your life. Would you like to work for us'
      )

      await this.botYesOrNo().then((workForTSO) => {
        this.setResponse({ workForTSO })
      })

      if (this.response.workForTSO === true) {
        await this.botMessage(
          `${this.response.name}, please enter your e-mail adress here, so we can get in touch with you`
        )

        await this.botEmailInput('Your email').then((email) => {
          this.setResponse({ email })
        })

        await this.botMessage('Thank you! You will hear from us.')
      } else {
        await this.botMessage('Our paths diverge here')
        await this.botMessage('Have a good time anways')

        // Go to exit dialogue
        this.exit()
      }
    },
  },
}
