// Import conversation branches
import CapitalismDiscourse from '../conversation/capitalismDiscourse.js'
import InvestInArt from '../conversation/investInArt.js'

export default {
  mixins: [CapitalismDiscourse, InvestInArt],
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

      this.d.shortOnTime = await this.botYesOrNo()

      if (this.d.shortOnTime.value === true) {
        this.capitalismDiscourse()
      } else {
        this.investInArt()
      }
    },
  },
}
