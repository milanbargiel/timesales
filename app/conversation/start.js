// Import conversation branches
import ShortInTime from '../conversation/shortInTime.js'
import NotShortInTime from '../conversation/notShortInTime.js'

export default {
  mixins: [ShortInTime, NotShortInTime],
  methods: {
    async startConversation() {
      await this.botMessage('Hi, good to see you!')

      await this.botMessage("What's your name?")

      const name = await this.botui.action.text({
        action: {
          placeholder: 'Your name',
        },
      })

      await this.botMessage(name.value + ', Nice to meet you!')

      await this.botMessage('Are you short of time?')

      // Ask pushy questions untill the user answers the question
      let askFurther = true

      this.botYesOrNo().then((response) => {
        // Do not continue asking
        askFurther = false
        // Branch dialogue based on response
        response.value ? this.shortInTime() : this.notShortInTime()
      })

      await this.timeout(10000)

      if (askFurther) {
        await this.botMessage(
          "isn't there lot's of projects you wuld like to realize if you only had the time for it?"
        )
      }

      await this.timeout(4000)

      if (askFurther) {
        await this.botMessage(
          'What would you do if you had all the <i>time</i> you wanted?'
        )

        this.botui.action
          .text({
            action: {
              placeholder: 'Your answer',
            },
          })
          .then((res) => this.checkout(res.value, name))
      }
    },
  },
}
