export default {
  methods: {
    async isItGod() {
      await this.botMessage(
        'Do you believe in the invisible hand of the market or the invisible hand of god?'
      )

      // botAiComment takes three parameters
      // userInput, fieldName and nextBotMessage
      await this.botTextInput('Your answer').then(async (response) => {
        // Add keywords to the user input to make the ai generated comment more relevant
        const augmentedUserInput =
          'Gods invisible hand of the market, ' + response

        await this.botAiComment(
          augmentedUserInput,
          'isItGodComments',
          'Do you think value is created through belief?'
        )
      })

      await this.botTextInput('Your answer').then(async (response) => {
        const augmentedUserInput = 'Belief in value, ' + response

        await this.botAiComment(
          augmentedUserInput,
          'isItGodComments',
          'Can money be sacred?'
        )
      })

      await this.botTextInput('Your answer').then(async (response) => {
        const augmentedUserInput = 'Can money be sacred, ' + response
        await this.botAiComment(augmentedUserInput, 'isItGodComments')
      })

      await this.recursivelyContinue()
    },
    async recursivelyContinue() {
      await this.botTextInput('Your answer').then(async (response) => {
        const augmentedUserInput = 'Can money be sacred, ' + response
        await this.botAiComment(augmentedUserInput, 'isItGodComments')

        this.recursivelyContinue()
      })
    },
  },
}
