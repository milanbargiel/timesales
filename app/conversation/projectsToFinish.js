// Import conversation branches
import AmountOfTime from '../conversation/amountOfTime'
import IsItGod from '../conversation/isItGod'
import PrioritizationProblems from '../conversation/prioritizationProblems.js'

export default {
  mixins: [AmountOfTime, IsItGod, PrioritizationProblems],
  methods: {
    async projectsToFinish() {
      await this.botMessage(
        "Aren't there lots of projects you would like to finish if you only had the time for it?"
      )

      await this.botYesOrNo().then((projectsToFinish) => {
        this.saveResponse({ projectsToFinish })
      })

      // On no
      if (this.response.projectsToFinish === false) {
        // Go to prioritization problems dialogue
        this.prioritizationProblems()
        return
      }

      await this.botMessage(
        'So what would you do if you had all the time you ever wished for'
      )

      await this.botTextInput('Your answer').then(async (response) => {
        await this.botAiComment(response, 'timePurpose')
      })

      await this.botMessage(
        `But why don't you ${this.response.timePurpose.userInput.toLowerCase()} in this world of finite lifespans? Is it not important enough?`
      )

      await this.botMessage('Shall we give it a little bit of extra value?')

      const response = await this.botYesOrNo()

      if (response === true) {
        await this.botMessage(
          `Ok, then I'll sell you some time for ${this.response.timePurpose.userInput.toLowerCase()}.`
        )

        await this.botMessage('How much is it going to be?')

        // Go to hold on dialogue
        this.amountOfTime()
      } else {
        // Go to isItGod dialogue
        this.isItGod()
      }
    },
  },
}
