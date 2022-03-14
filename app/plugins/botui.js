import vue from 'vue'
import Botui from 'botui'
import { escape } from 'html-escaper'

vue.mixin({
  methods: {
    timeout(ms, promise) {
      // No delays in debug mode
      if (this.debugMode) {
        return Promise.resolve()
      }

      // Set timeout
      const timeout = new Promise((resolve, reject) => {
        const id = setTimeout(() => {
          clearTimeout(id)
          resolve() // Return undefined if answer was not given in time
        }, ms)
      })

      // Returns a race between our timeout and the passed in promise
      if (!promise) {
        return timeout
      } else {
        return Promise.race([promise, timeout])
      }
    },
    timeToWrite(sentence) {
      // No delays in debug mode
      if (this.debugMode) {
        return 100
      }

      // The factor can be defined in the strapi backend
      const { timeToWriteFactor } = this.$store.state.config

      // Calculate time for bot to write a message
      // Min value is 2 seconds
      return Math.max(sentence.length * timeToWriteFactor, 2000)
    },
    botMessage(content, customDelay) {
      // Returns html escaped content e.g. <i> becomes "&lti&lt"
      // This done to allow special characters in names
      // Todo: Build a proper validation that does not allow special characters for user inputs
      return this.botui.message.add({
        delay: customDelay || this.timeToWrite(content),
        loading: true,
        type: 'html',
        content: escape(content), // Replace special characters e.g. < => "&lt;"
      })
    },
    botMessageHtml(content, customDelay) {
      // Allows html as for example <i>time</i>
      return this.botui.message.add({
        delay: customDelay || this.timeToWrite(content),
        loading: true,
        type: 'html',
        content,
      })
    },
    async botTextInput(placeholder) {
      const res = await this.botui.action.text({
        action: {
          placeholder,
        },
      })
      return res.value // only return value property
    },
    // A function that generates an aiComment for userInput
    // If a nextBotMessage is defined, it will be shown without additional delay, if ai comment generation fails
    // (Due to a timeout of the gpt2 app)
    async botAiComment(userInput, fieldName, nextBotMessage) {
      await this.botui.message
        .add({
          // 1. Add an empty dummy message to show the loading indicator
          loading: true,
        })
        .then(async (index) => {
          // 2. Create a gpt2 based ai comment by posting the userInput to the backend
          await this.generateAiComment({
            [fieldName]: {
              userInput,
            },
          }).then(async (response) => {
            // 3A. When ai comment generation suceeded update the dummy message with content
            if (response && response[fieldName].enhancedOutput) {
              this.botui.message.update(index, {
                loading: false,
                content: response[fieldName].enhancedOutput,
              })

              nextBotMessage && (await this.botMessage(nextBotMessage))
            } else if (nextBotMessage) {
              // 3B. If ai comment generation failed, show next bot message without additional delay
              this.botui.message.update(index, {
                loading: false,
                content: nextBotMessage,
              })
            } else {
              // 3C. If ai comment generation failed an no next message is defined,
              // remove message and continue with the regular dialogue
              this.botui.message.remove(index)
            }
          })
        })
    },
    async botNumberInput(placeholder) {
      const res = await this.botui.action.text({
        action: {
          sub_type: 'number',
          placeholder,
        },
      })
      return parseInt(res.value) // only return value property as a number
    },
    async botEmailInput(placeholder) {
      const res = await this.botui.action.text({
        action: {
          sub_type: 'email',
          placeholder,
        },
      })
      return res.value // only return value property
    },
    async botYesOrNo() {
      const res = await this.botui.action.button({
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
      return res.value
    },
    hidePushyQuestion() {
      // Get loading container of bot
      const domElement = this.$el.querySelector(
        '.botui-message-content.loading'
      )

      // Hide parent node
      if (domElement) {
        domElement.parentNode.style.display = 'none'
      }
    },
  },
})

export default ({ app }, inject) => {
  // Inject $botui(selector) in Vue, context and store.
  inject('botui', (selector) => new Botui(selector, { vue }))
}
