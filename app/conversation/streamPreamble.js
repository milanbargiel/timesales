export default {
  methods: {
    async streamPreamble() {
      await this.botMessage('Thank you for your order!')

      await this.botMessage('Get out of here and use your time!')

      await this.botMessage(
        'It is your own responsibility to use your time as intended'
      )

      await this.botMessage(
        'But if you would like to have a reference for the passing of your purchased time, please watch your custom time stream'
      )

      const showStream = await this.botui.action.button({
        action: [
          {
            text: 'I would like to use my time freely',
            value: false,
          },
          {
            text: 'Take me to the stream',
            value: true,
          },
        ],
      })

      if (showStream.value) {
        await this.botMessage('Okay, then follow me.')

        await this.botMessage(
          "Don't worry, you can pause your stream whenever you feel like it"
        )

        await this.timeout(5000)

        // Begin sand simulation
        this.beginStream()
      } else {
        await this.botMessage(
          'If at any point you change your mind, you can still access the time stream from a link in the email we sent you'
        )

        // Begin sand simulation
        this.feedback()
      }
    },
  },
}
