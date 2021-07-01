// Import conversation branches
import MemberOfChurch from '../conversation/memberOfChurch.js'

export default {
  mixins: [MemberOfChurch],
  methods: {
    async amountOfTime() {
      await this.botui.action
        .button({
          autoHide: false,
          action: [
            {
              text: 'Seconds',
              value: 'seconds',
            },
            {
              text: 'Minutes',
              value: 'minutes',
            },
            {
              text: 'Hours',
              value: 'hours',
            },
            {
              text: 'Days',
              value: 'days',
            },
            {
              text: 'Weeks',
              value: 'weeks',
            },
            {
              text: 'Years',
              value: 'years',
            },
          ],
        })
        .then((res) => {
          this.setResponse({ timeUnit: res.value })
        })
      await this.botNumberInput(`Number of ${this.response.timeUnit}`).then(
        (timeAmount) => {
          this.setResponse({ timeAmount })
        }
      )

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
