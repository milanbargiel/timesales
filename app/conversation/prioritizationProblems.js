// Import conversation branches
import InControl from '../conversation/inControl.js'
import AmountOfTime from '../conversation/amountOfTime.js'
import PurposeOfTime from '../conversation/purposeOfTime.js'

export default {
  mixins: [InControl, AmountOfTime, PurposeOfTime],
  methods: {
    async prioritizationProblems() {
      await this.botMessage('Do you struggle to set your priorities?')

      await this.botYesOrNo().then((prioritizationProblems) => {
        this.saveResponse({ prioritizationProblems })
      })

      // On no
      if (this.response.prioritizationProblems === false) {
        // Go to in control branch
        this.inControl()
        return
      }

      // On yes
      await this.botMessage(
        'I know it seems difficult, but actually it can be pretty simple'
      )

      await this.botMessage('What are the most important things in your life?')

      await this.botMessage('Friends and family?')

      await this.botMessage('Health?')

      await this.botMessage('Something else?')

      // Ask for purpose of time

      // Wait for 15 seconds. If user does not answers by then, remove input field and continue.
      const question = this.timeout(15000, this.botTextInput('Your answer'))

      await question.then(async (response) => {
        if (response !== undefined) {
          await this.botAiComment(response, 'timePurpose')
        }
        this.botui.action.hide() // hide question
      })

      await this.botMessage(
        "Sometimes we tend to underrate those things. I think it's time to boost their value"
      )

      await this.botMessage(
        "In order to do that I'll sell you some time for your neglected priority. The price tag gives a greater incentive to use the time in it's intended way"
      )

      await this.botMessage(
        "I know value is relative, that's why you set the price yourself. The rules are easy: if you feel that you can lose that amount of money without pain, the price is too low. If it will make your future impossible, it's too high"
      )

      // If purpose of time was already given
      if (this.response.timePurpose) {
        await this.botMessage(
          'But first, I need to know how much time you need'
        )
        // Go to amount of time dialogue
        this.amountOfTime()
      } else {
        await this.botMessage('What would you like to have time for?')

        // Go to purpose of time dialogue
        this.purposeOfTime()
      }
    },
  },
}
