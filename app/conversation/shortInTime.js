// Import conversation branches
import Checkout from '../conversation/checkout.js'

export default {
  mixins: [Checkout],
  methods: {
    async shortInTime() {
      await this.botMessage(
        "Why don't you have enough time? Is it because of capitalism?"
      )

      const capitalism = await this.botYesOrNo()

      if (capitalism.value) {
        await this.botMessage(
          "Ok, let's beat capitalism with it's own weapons: I'll sell you some time, so you can jump right out of the Hamster wheel of Artificial scarcity and harmful competition."
        )
      } else {
        await this.botMessage(
          "no? you're smart. It's because of your own time management. Maybe i can help you to improve it. What would you say if we give the things you'd like to do some extra value?"
        )

        await this.botMessage(
          "You tell me what you would like to do and i'll sell you some <i>time</i> for especially that purpose I assume it will give you just the right amount of pressure to use that time for it's intend. you don't want to lose both, money and time, right?"
        )

        await this.botMessage("so let's get to it")
      }

      await this.botMessage(
        'For which purpose would you like to have some <i>time</i>?'
      )

      this.order.description = await this.botTextInput('Your answer')

      if (this.order.description) {
        // Proceed to checkout
        this.checkoutConversation()
      }
    },
  },
}
