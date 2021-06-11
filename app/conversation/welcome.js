// Import conversation branches
import ShortInTime from '../conversation/shortInTime.js'
import NotShortInTime from '../conversation/notShortInTime.js'
import Checkout from '../conversation/checkout.js'

export default {
  mixins: [ShortInTime, NotShortInTime, Checkout],
  methods: {
    async welcome() {
      await this.botMessage('Hi, good to see you!')

      await this.botMessage("What's your name?")

      // Save name in data property
      this.d.name = await this.botTextInput('Your name')

      await this.botMessage(
        this.d.name +
          ', nice to meet you! Do you mind if we record our conversation for the improvement of our services?'
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
