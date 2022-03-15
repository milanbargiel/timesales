// Import conversation branches
import CapitalismDiscourse from '../conversation/capitalismDiscourse.js'
import InvestInArt from '../conversation/investInArt.js'
import ProjectsToFinish from '../conversation/projectsToFinish.js'

export default {
  mixins: [CapitalismDiscourse, InvestInArt, ProjectsToFinish],
  methods: {
    async nameInput() {
      await this.botTextInput('Your name').then(async (name) => {
        // Save reponses in vuex store
        this.saveResponse({ name })

        const evasiveAnswer = ['why', "won't", "don't", 'not'].some(
          // Check if the evasive answers listed above are part of the name string
          // Only look for whole words
          (evasiveAnswer) =>
            name.toLowerCase().split(' ').includes(evasiveAnswer)
        )

        if (evasiveAnswer) {
          await this.botMessage(
            'I just wanted to be polite, but I accept pseudonyms of course'
          )
          await this.nameInput() // recursion
        }
      })
    },
    async welcome() {
      await this.botMessage(
        'Hello, I am here to guide you through our service. How may I call you?'
      )

      // Ask the user for his/her name
      await this.nameInput()

      await this.botMessage(
        this.response.name +
          ', nice to meet you. Would it be okay if I record our conversation for quality control purposes?'
      )

      this.showPrivacyInfo = true

      await this.botYesOrNo().then((allowRecording) => {
        this.showPrivacyInfo = false
        this.saveResponse({ allowRecording })
      })

      await this.botMessage('Are you sometimes short on time?')

      // When user does not answer question afters 12 secs proceed to projects to finish dialogue
      const question = this.timeout(12000, this.botYesOrNo())

      question.then((response) => {
        if (response === undefined) {
          this.botui.action.hide() // Remove answer possibility to this question
          this.saveResponse({ shortOnTime: 'hesitant' })
          this.projectsToFinish()
        } else {
          const shortOnTime = response
          this.saveResponse({ shortOnTime })
          shortOnTime ? this.capitalismDiscourse() : this.investInArt()
        }
      })
    },
  },
}
