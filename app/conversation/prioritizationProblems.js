// Import conversation branches
import InControl from '../conversation/inControl.js'
import AmountOfTime from '../conversation/amountOfTime.js'
import PurposeOfTime from '../conversation/purposeOfTime.js'

export default {
  mixins: [InControl, AmountOfTime, PurposeOfTime],
  methods: {
    async prioritizationProblems() {
      await this.botMessage(
        'Do you struggle setting your priorities as you would like them to be?'
      )

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
      await this.botMessage('I know it can be difficult.')

      await this.botMessage(
        'But pretty simple at the same time. what are the most important things in life?'
      )

      await this.botMessage('Friends and Family?')

      await this.botMessage('Health?')

      await this.botMessage('Anything else?')

      // Ask for purpose of time but do not wait for answer
      this.botTextInput('Your answer').then((timePurpose) => {
        // Save answer
        this.saveResponse({ timePurpose })
      })

      await this.timeout(10000)

      await this.botMessage(
        "Sometimes we tend to underrate those things. I think it's time to boost their value."
      )

      await this.botMessage(
        "In order to do that i'll sell you some time for your neglected priority. the pricetag takes care about you making sure to use the time in it's intended way. "
      )

      await this.botMessage(
        "I know value is relative. that's why you set the price yourself. the rules are easy: if you feel that you can loose that amount of money without pain, the price is too low. If it will make your future impossible, it's too high."
      )

      // If purpose of time was already given
      if (this.response.timePurpose) {
        await this.botMessage(
          'But first i need to know how much time it shall be'
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
