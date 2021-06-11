// Import conversation branches
import MemberOfChurch from '../conversation/memberOfChurch.js'

export default {
  mixins: [MemberOfChurch],
  methods: {
    async purposeOfTime() {
      // Look for predefined keywords in the description of the time needed
      const keyword = this.lookForKeyword(this.d.timeType)

      if (keyword) {
        await this.botMessage(`Ah good choice, I like to ${keyword} too.`)
      } else {
        await this.botMessage('Excellent choice')
      }

      await this.botMessage(
        'Hold on, I have a premium customer on the other line...'
      )

      await this.timeout(10000)

      await this.botMessage('Where were we? You wanted to buy some time right?')
      await this.botMessage('How much is it going to be?')

      this.d.timeAmount = await this.botNumberInput('Time in seconds')

      if (this.d.timeAmount > 60) {
        await this.botMessage(
          'That much? Very good, you dive right in, I respect that!'
        )
      } else {
        await this.botMessage(
          "So little? That's what I call a timid investment."
        )
      }

      // Go to member of church dialogue
      this.memberOfChurch()
    },
  },
}
