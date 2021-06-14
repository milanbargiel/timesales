// Import conversation branches
import Checkout from '../conversation/checkout.js'
import Exit from '../conversation/exit.js'

export default {
  mixins: [Checkout, Exit],
  methods: {
    async memberOfChurch() {
      await this.botMessage('Are you a member of the church?')

      await this.botYesOrNo().then((memberOfChurch) => {
        this.setResponse({ memberOfChurch })
      })

      if (this.response.memberOfChurch === false) {
        await this.botMessage('Ok, then we can continue')

        // Go to checkout dialogue
        this.checkout()
      } else {
        await this.botMessage(
          'The church says that time is a present of god and that it shall not be sold. You better think over it twice to make sure you’re not doing a business deal with the devil'
        )

        await this.botui.action
          .button({
            action: [
              {
                text: "I don't care",
                value: false,
              },
              {
                text:
                  'Right, I’m also much too much afraid of burning in hell.',
                value: true,
              },
            ],
          })
          .then((response) => {
            this.setResponse({ afraidOfHell: response.value })
          })

        if (this.response.afraidOfHell === true) {
          await this.botMessage('Our paths diverge here')
          await this.botMessage('Have a good time anyways')
          return this.exit()
        } else {
          // Go to checkout dialogue
          this.checkout()
        }
      }
    },
  },
}
