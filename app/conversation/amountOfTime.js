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
          // Count number of digits, take into account the scientific notation for great numbers (e.g. 1e+35).
          const numberOfDigits = (Math.log(timeAmount) * Math.LOG10E + 1) | 0

          if (timeAmount <= 0) {
            await this.botMessage(
              'Your input was not correct. Please choose a value bigger than 0.'
            )
            await this.timeInput() // recursion
          } else if (numberOfDigits > 10) {
            // Do not save more than 10 digits because the timestring package cannot handle it.
            await this.botMessage(
              "More than a lifetime? That's excessive! It would be irresponsible on our part if we sold you that much time. Please choose a smaller amount of time."
            )
            await this.timeInput()
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
          "More than a lifetime? That's excessive! It would be irresponsible on our part if we sold you that much time. Please choose a smaller amount of time."
        )

        // Ask again
        await this.timeInput()
      } else if (timeInSeconds >= 86400) {
        // 86400 sec = 1 day
        await this.botMessage(
          'That much? Very good, you dive right in, I respect that!'
        )
      } else if (timeInSeconds >= 300) {
        // 300 sec = 5min
        await this.botMessage('Very well.')
      } else {
        await this.botMessage(
          "So little? That's what I call a timid investment."
        )
      }

      // Generate an ai comment for the time input
      await this.botAiComment(time, 'timeValue')

      // Go to member of church dialogue if user comes from capitalismDiscourse dialogue
      if (
        this.response.becauseOfCapitalism === true ||
        this.response.becauseOfCapitalism === false ||
        this.response.reasonShortOnTime
      ) {
        this.memberOfChurch()
      } else {
        this.checkout()
      }
    },
  },
}
