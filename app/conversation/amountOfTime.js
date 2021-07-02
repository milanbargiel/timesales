// Import conversation branches
import timestring from 'timestring' // to convert time
import MemberOfChurch from '../conversation/memberOfChurch.js'

export default {
  mixins: [MemberOfChurch],
  methods: {
    async timeInput() {
      await this.botNumberInput(`Number of ${this.response.timeUnit}`).then(
        async (timeAmount) => {
          if (timeAmount <= 0) {
            await this.botMessage(
              'Your input was not correct. Please choose a value bigger than 0.'
            )
            await this.timeInput() // recursion
          } else {
            this.setResponse({ timeAmount })
          }
        }
      )
    },
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

      // Ask for timeAmount in input field with basic validation
      await this.timeInput()

      const timeInSeconds = timestring(
        `${this.response.timeAmount} ${this.response.timeUnit}`
      )

      if (timeInSeconds >= 18000) {
        // 18000 sec = 5 hours
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
