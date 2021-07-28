export default {
  methods: {
    async streamPreamble() {
      await this.botMessage('Thank you for your order!')

      await this.botMessage('Do you want to use your time right now?')

      const useTime = await this.botui.action.button({
        action: [
          {
            text: 'Yes',
            value: true,
          },
          {
            text: 'I want to use it later',
            value: false,
          },
        ],
      })

      if (useTime.value) {
        await this.botMessage(
          'We offer a custom time stream as reference for the passing of your purchased time. Would you like to access it?'
        )

        const showStream = await this.botui.action.button({
          action: [
            {
              text: 'Yes, please take me to the stream',
              value: true,
            },
            {
              text: 'I would like to use my time freely',
              value: false,
            },
          ],
        })

        if (showStream.value) {
          await this.botMessage('Okay, then follow me.')

          await this.botMessage(
            "Don't worry, you can pause your stream whenever you feel like it."
          )

          await this.timeout(5000)

          // Begin sand simulation
          this.beginStream()
        } else {
          await this.botMessage(
            'If at any point you change your mind, you can still access the time stream from a link in the email we sent you.'
          )
        }
      } else {
        // I want to use my time later
        await this.botMessage(
          'You can use your time whenever you wish. In the email we sent you, you´ll find a link to your custom time stream which can be helpful as a reference for the passing of your time.'
        )

        // Offer a restart
        this.botui.action
          .button({
            action: [
              {
                text: 'Take me back to where it all began',
              },
            ],
          })
          .then(() => {
            // Reloads the component
            this.$router.push({ path: '/' })
          })
      }
    },
  },
}
