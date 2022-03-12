// Import conversation branches
import Feedback from '../conversation/feedback.js'
import IsItGod from '../conversation/isItGod.js'

export default {
  mixins: [Feedback, IsItGod],
  methods: {
    async inControl() {
      await this.botMessage(
        'You seem very much in control over your life. Would you work for us?'
      )

      await this.botYesOrNo().then((workForUs) => {
        this.saveResponse({ workForUs })
      })

      if (this.response.workForUs === true) {
        await this.botMessage(
          `${this.response.name}, please enter your email address here so we can get in touch with you`
        )

        await this.botEmailInput('Your email').then((applicationEmail) => {
          // Always save this answer, even when user does not want data collection.
          this.saveResponse({ applicationEmail })
        })

        await this.botMessage('Thank you! You will hear from us')

        // Go to feedback dialogue
        this.feedback()
      } else {
        // Go to IsItGod dialogue
        this.isItGod()
      }
    },
  },
}
