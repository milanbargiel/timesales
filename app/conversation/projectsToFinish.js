// Import conversation branches
import AmountOfTime from '../conversation/amountOfTime.js'
import PrioritizationProblems from '../conversation/prioritizationProblems.js'

export default {
  mixins: [AmountOfTime, PrioritizationProblems],
  methods: {
    async projectsToFinish() {
      await this.botMessage(
        'Aren’t there lots of projects you would like to finish if you only had the time for it?'
      )

      await this.botYesOrNo().then((projectsToFinish) => {
        this.setResponse({ projectsToFinish })
      })

      // On no
      if (this.response.projectsToFinish === false) {
        // Go to prioritization problems dialogue
        this.prioritizationProblems()
        return
      }

      await this.botMessage(
        'So, what would you do if you had all the time you ever wanted?'
      )

      await this.botTextInput('Your answer').then((timePurpose) => {
        this.setResponse({ timePurpose })
      })

      await this.botMessage(
        `Ok, if you had all the time in the world you would ${this.response.timePurpose}. But why don't you do it in this world of finite lifespans? Is it not important enough?`
      )

      await this.botMessage('Shall we give it a little bit of extra value?')

      await this.botui.action.button({
        action: [
          {
            text: 'Yes',
          },
        ],
      })

      await this.botMessage(
        `Ok, then i'll sell you some time for ${this.response.timePurpose}.`
      )

      // Go to amount of time dialogue
      this.amountOfTime()
    },
  },
}
