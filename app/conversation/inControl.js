// Import conversation branches
import Exit from '../conversation/exit.js'

export default {
  mixins: [Exit],
  methods: {
    async inControl() {
      await this.botMessage(
        'You seem to be very much in control over your life. Would you like to work for us?'
      )

      await this.botYesOrNo().then((workForUs) => {
        this.saveResponse({ workForUs })
      })

      if (this.response.workForUs === true) {
        await this.botMessage(
          `${this.response.name}, please enter your email address here so we can get in touch with you.`
        )

        await this.botEmailInput('Your email').then((applicationEmail) => {
          // Always save this answer, even when user does not want data collection.
          this.saveResponse({ applicationEmail })
        })

        await this.botMessage('Thank you! You will hear from us')
      } else {
        await this.botMessage('Looks like our paths diverge here.')
        await this.botMessage('Have a good time anyways.')

        // Go to exit dialogue
        this.exit()
      }
    },
  },
}
