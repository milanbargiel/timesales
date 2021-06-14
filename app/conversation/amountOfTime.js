// Import conversation branches
import MemberOfChurch from '../conversation/memberOfChurch.js'

export default {
  mixins: [MemberOfChurch],
  methods: {
    async amountOfTime() {
      await this.botMessage(
        'Hold on, I have a premium customer on the other line...'
      )

      await this.timeout(10000)

      await this.botMessage('Where were we? You wanted to buy some time right?')
      await this.botMessage('How much is it going to be?')

      await this.botNumberInput('Time in seconds').then((timeAmount) => {
        this.setResponse({ timeAmount })
      })

      if (this.response.timeAmount > 60) {
        await this.botMessage(
          'That much? Very good, you dive right in, I respect that!'
        )
      } else {
        await this.botMessage(
          "So little? That's what I call a timid investment."
        )
      }

      // Go to member of church dialogue if user comes from capitalismDiscourse
      if (
        this.response.becauseOfCapitalism === true ||
        this.response.becauseOfCapitalism === false
      ) {
        this.memberOfChurch()
      } else {
        this.checkout()
      }
    },
  },
}
