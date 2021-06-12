// Import conversation branches
import CapitalismDiscourse from '../conversation/capitalismDiscourse.js'
import InvestInArt from '../conversation/investInArt.js'
import ProjectsToFinish from '../conversation/projectsToFinish.js'

export default {
  mixins: [CapitalismDiscourse, InvestInArt, ProjectsToFinish],
  methods: {
    async welcome() {
      await this.botMessage('Hi, good to see you!')

      await this.botMessage("What's your name?")

      // Save name in data property
      this.d.name = await this.botTextInput('Your name')

      await this.botMessage(
        this.d.name +
          ', would it be okay if I record our conversation to improve the quality of service?'
      )

      // Save decision in data property
      this.d.allowRecording = await this.botYesOrNo()

      await this.botMessage('Are you sometimes short on time?')

      // Ask pushy questions untill the user answers the question
      let askFurther = true

      this.botYesOrNo().then((response) => {
        askFurther = false // Do not continue asking
        this.d.shortOnTime = response // save value
        response.value ? this.capitalismDiscourse() : this.investInArt()
      })

      await this.timeout(10000)

      if (askFurther) {
        this.d.shortOnTime = 'hesitant'
        this.hidePushyQuestion()
        this.projectsToFinish()
      }
    },
  },
}
