// Import conversation branches
import timestring from 'timestring' // to convert time
import MemberOfChurch from '../conversation/memberOfChurch.js'
import Exit from '../conversation/exit.js'

export default {
  mixins: [MemberOfChurch, Exit],
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
            this.saveResponse({ timeAmount })
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
          this.saveResponse({ timeUnit: res.value })
        })

      // Ask for timeAmount in input field with basic validation
      await this.timeInput()

      const time = `${this.response.timeAmount} ${this.response.timeUnit}`

      const timeInSeconds = timestring(time)
      const timeInYears = timestring(time, 'y')

      if (timeInYears > 80) {
        await this.botMessage(
          'More than a lifetime? That is excessive! And would be irresponsible on our part if we sold you that much time.'
        )

        return this.exit()
      } else if (timeInSeconds >= 18000) {
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
