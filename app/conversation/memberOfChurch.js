// Import conversation branches
import Checkout from '../conversation/checkout.js'
import Exit from '../conversation/exit.js'

export default {
  mixins: [Checkout, Exit],
  methods: {
    async memberOfChurch() {
      await this.botMessage('Are you a member of the church?')

      this.d.memberOfChurch = await this.botYesOrNo()

      if (this.d.memberOfChurch.value === false) {
        await this.botMessage('Ok, then we can continue')

        // Go to checkout dialogue
        this.checkout()
      } else {
        await this.botMessage(
          'The church says that time is a present of god and that it shall not be sold. You better think over it twice to make sure you’re not doing a business deal with the devil'
        )

        this.d.afraidOfHell = await this.botui.action.button({
          action: [
            {
              text: "I don't care",
              value: false,
            },
            {
              text: 'Right, I’m also much too much afraid of burning in hell.',
              value: true,
            },
          ],
        })

        if (this.d.afraidOfHell.value === true) {
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
