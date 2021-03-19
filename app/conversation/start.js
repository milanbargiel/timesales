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

      await this.botui.action
        .button({
          action: [
            {
              text: 'Yes',
              value: true,
            },
            {
              text: 'No',
              value: false,
            },
          ],
        })
        .then((response) => {
          // Branch dialogue based on response
          response.value ? this.shortInTime() : this.notShortInTime()
        })
    },
  },
}
