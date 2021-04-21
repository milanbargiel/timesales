export default {
  methods: {
    async checkoutConversation() {
      // Look for define keywords in the description of the time needed
      const keyword = this.lookForKeyword(this.order.description)

      if (keyword) {
        await this.botMessage(`Ah good choice, I like to ${keyword} too.`)
      } else {
        await this.botMessage('Excellent choice')
      }

      await this.botMessage(
        'Hold on, I have a premium customer on the other line'
      )

      await this.timeout(10000)

      await this.botMessage(
        `${this.order.name}, where were we? you wanted to buy some <i>time</i> right?'`
      )

      await this.botMessage('How much <i>time</i> shall it be?')

      this.order.time = await this.botNumberInput('Time in seconds')

      if (this.order.time > 60) {
        await this.botMessage(
          'That much? very good, you draw from the full, I like that!'
        )
      } else {
        await this.botMessage(
          "so little? That's what I call a timid investment."
        )
      }

      await this.botMessage('Are you a member of the church?')

      const church = await this.botYesOrNo()

      if (church.value === false) {
        await this.botMessage('ok, then we can continue')
      } else {
        await this.botMessage(
          "the church says that time is a present of god and that we shall not sell it. i think you better think over it twice, just to make sure you don't make business with the devil"
        )

        const afraidOfGod = await this.botui.action.button({
          action: [
            {
              text: "I don't care",
              value: false,
            },
            {
              text: "Right, i'm too much afraid of burning in hell",
              value: true,
            },
          ],
        })

        if (afraidOfGod === true) {
          return this.exitConversation()
        }
      }

      await this.botMessage('What would that <i>time</i> be worth to you?')

      this.order.price = (await this.botNumberInput('Worth in €')) * 100

      // const euro = await (() => {
      //   // Show message after 10 sec if user does not enter a value
      //   const t1 = setTimeout(async () => {
      //     await this.botMessage(
      //       'Some people base their descisions on their hourly income, other choose a more idealistic approximation. I always ask myself: <i>which amount of money would hurt a little bit</i> that should be enough to make your time precious.',
      //       100
      //     )
      //   }, 10000)

      //   // After 25 sec show another prompt
      //   const t2 = setTimeout(async () => {
      //     await this.botMessage(
      //       "ultimately you'll have to ask yourself <i>what am i willing to spend? what's appropriate and won't ruin myself?</i>",
      //       100
      //     )
      //   }, 25000)

      //   return this.botui.action
      //     .text({
      //       action: {
      //         sub_type: 'number',
      //         placeholder: 'Worth in €',
      //       },
      //     })
      //     .then((response) => {
      //       // Do not show pushy questions anymore when price is given
      //       // TODO: Improve mechanism, that when user already gave a price bots stop writing
      //       clearTimeout(t1)
      //       clearTimeout(t2)
      //       return response
      //     })
      // })()

      // Only continue when user enters value
      if (this.order.price) {
        await this.botMessage(
          `sweet, you chose to buy ${this.order.time} seconds for ${
            this.order.price / 100
          } €.`
        )

        this.showCheckoutButton = true
      }
    },
  },
}
