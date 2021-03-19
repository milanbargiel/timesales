<template>
  <div class="container">
    <div>
      <div id="botui">
        <bot-ui />
      </div>
    </div>
  </div>
</template>

<script>
import vue from 'vue'
import Botui from 'botui'
import Welcome from '../conversation/welcome.js'

export default {
  mixins: [Welcome],
  data() {
    return {
      botui: '',
    }
  },
  async mounted() {
    await this.$nextTick()
    this.botui = new Botui('botui', { vue })
    this.checkout('Time to think.')
    this.myAwesomMethod()
    this.$hello('petter')
  },
  methods: {
    // wrapper function to pass global variables to botui messages
    botMessage(content) {
      return this.botui.message.add({
        delay: 2000,
        loading: true,
        content,
      })
    },
    keywordFilter(text) {
      const str = text.toLowerCase()
      // verb infinitives work fine in the answers
      const list = ['think', 'relax', 'be by myself', 'work', 'read']
      return list.find((word) => str.includes(word))
    },
    timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    async exitConversation() {
      await this.botMessage('Goodbye then.')
    },
    async checkout(purpose) {
      await this.botMessage('How much time shall it be?')

      const minutes = await this.botui.action.text({
        action: {
          sub_type: 'number',
          placeholder: 'Time in minutes',
        },
      })

      if (minutes.value > 60) {
        await this.botMessage(
          'That much? very good, you draw from the full, I like that!'
        )
      } else {
        await this.botMessage(
          "so little? That's what I call a timid investment."
        )
      }

      await this.botMessage('Are you a menber of the church?')

      const church = await this.botui.action.button({
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

      if (church.value === false) {
        await this.botMessage('ok, then we can continue')
      } else {
        await this.botMessage(
          "the church says that time is a present of god and that we shall not sell it. i think you better think over it twice, just to make sure you don't make business with the devil"
        )

        const afraidOfGod = await this.botui.action.button({
          action: [
            {
              text: "I don't care",
              value: false,
            },
            {
              text: "Right, i'm too much afraid of burning in hell",
              value: true,
            },
          ],
        })

        if (afraidOfGod === true) {
          return this.exitConversation()
        }
      }

      await this.botMessage('What would that time be worth to you?')

      const euro = await (async () => {
        // Show message after 10 sec if user does not enter a value
        setTimeout(async () => {
          await this.botMessage(
            'Some people base their descisions on their hourly income, other choose a more idealistic approximation. I always ask myself: which amount of money would hurt a little bit that should be enough to make your time precious.'
          )
        }, 10000)

        // After 25 sec show another prompt
        setTimeout(async () => {
          await this.botMessage(
            "ultimately you'll have to ask yourself what am i willing to spend? what's appropriate and won't ruin myself?"
          )
        }, 25000)

        return await this.botui.action.text({
          action: {
            sub_type: 'number',
            placeholder: 'Worth in €',
          },
        })
      })()

      // Only continue when user enters value
      if (euro.value) {
        await this.botMessage(
          'sweet, you chose to buy ' +
            // minutes.value +
            ' minutes for ' +
            euro.value +
            ' €.'
        )
      }
    },
    async shortInTime() {
      await this.botMessage(
        "Why don't you have enough time? Is it because of capitalism?"
      )

      const capitalism = await this.botui.action.button({
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

      if (capitalism.value) {
        await this.botMessage(
          "Ok, let's beat capitalism with it's own weapons: I'll sell you some time, so you can jump right out of the Hamster wheel of Artificial scarcity and harmful competition."
        )
      } else {
        await this.botMessage(
          "no? you're smart. It's because of your own time management. Maybe i can help you to improve it. What would you say if we give the things you'd like to do some extra value?"
        )

        await this.botMessage(
          "You tell me what you would like to do and i'll sell you some time for especially that purpose I assume it will give you just the right amount of pressure to use that time for it's intend. you don't want to lose both, money and time, right?"
        )

        await this.botMessage("so let's get to it")
      }

      await this.botMessage(
        'For which purpose would you like to have some time?'
      )

      const timeTo = await this.botui.action.text({
        action: {
          placeholder: 'Enter your text here',
        },
      })

      const keyword = this.keywordFilter(timeTo.value)

      if (keyword) {
        await this.botMessage('Ah, good choice. I like to ' + keyword + ' too.')
      } else {
        await this.botMessage('Are you sure?')
      }

      await this.botMessage(
        'Hold on, i have a premium cusomer on the other line.'
      )

      await this.wait(10000) // wait for 10 secs

      await this.botMessage('Where were we? You wanted to buy some time right?')
    },
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
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
