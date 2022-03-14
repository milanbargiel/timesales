export default {
  methods: {
    async isItGod() {
      await this.botMessage(
        'Do you believe in the invisible hand of the market or the invisible hand of god?'
      )

      // botAiComment takes three parameters
      // userInput, fieldName and nextBotMessage
      await this.botTextInput('Your answer').then(async (response) => {
        await this.botAiComment(
          response,
          'isItGodComments',
          'Do you think value is created through belief?'
        )
      })

      await this.botTextInput('Your answer').then(async (response) => {
        await this.botAiComment(
          response,
          'isItGodComments',
          'Can money be sacred?'
        )
      })

      await this.botTextInput('Your answer').then(async (response) => {
        await this.botAiComment(response, 'isItGodComments')
      })

      await this.recursivelyContinue()
    },
    async recursivelyContinue() {
      await this.botTextInput('Your answer').then(async (response) => {
        await this.botAiComment(response, 'isItGodComments')

        this.recursivelyContinue()
      })
    },
  },
}
