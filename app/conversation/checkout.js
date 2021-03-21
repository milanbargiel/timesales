export default {
  methods: {
    async checkout(purpose) {
      // Look for define keywords in purpose
      const keyword = this.lookForKeyword(purpose)

      if (keyword) {
        await this.botMessage(`Ah good choice, I like to ${keyword} too.`)
      } else {
        await this.botMessage('Excellent choice')
      }

      await this.botMessage(
        'Hold on, I have a premium customer on the other line'
      )

      await this.timeout(10000)

      await this.botMessage('Where were we? you wanted to buy some time right?')

      await this.botMessage('How much time shall it be?')

      const minutes = await this.botui.action.text({
        action: {
          sub_type: 'number',
          placeholder: 'Time in minutes',
        },
      })

      if (minutes.value > 60) {
        await this.botMessage(
          'That much? very good, you draw from the full, I like that!'
        )
      } else {
        await this.botMessage(
          "so little? That's what I call a timid investment."
        )
      }

      await this.botMessage('Are you a menber of the church?')

      const church = await this.botui.action.button({
        action: [
          {
            text: 'Yes',
            value: true,
          },
          {
            text: 'No',
            value: false,
          },
        ],
      })

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

      await this.botMessage('What would that time be worth to you?')

      const euro = this.botui.action
        .text({
          action: {
            sub_type: 'number',
            placeholder: 'Worth in €',
          }
        })

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
      if (euro.value) {
        await this.botMessage(
          `sweet, you chose to buy ${minutes.value} minutes for ${euro.value} €.`
        )

        const pay = await this.botui.action.button({
          action: [
            {
              text: 'Buy time',
            },
          ],
        })

        if (pay) {
          alert(
            `Congratulations. You bought ${minutes.value} minutes for ${euro.value} € !`
          )
        }
      }
    },
  },
}
