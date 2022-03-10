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

      // Calculate time for bot to write a message
      // Min value is 2 seconds
      return Math.max(sentence.length * 5, 500)
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
    async botAiComment(userInput, fieldName, nextBotMessage) {
      await this.botui.message
        .add({
          // Show loading indicator while waiting for an answer
          loading: true,
        })
        .then(async (index) => {
          // Send userInput to API to create a gpt2 based comment on the userInput
          // The maximum time to wait is defined in the cms controller
          await this.generateAiComment({
            [fieldName]: {
              userInput,
            },
          }).then(async (response) => {
            // If ai comment generation suceeded
            // Show ai comment before the next message
            if (response[fieldName].aiOutput) {
              this.botui.message.update(index, {
                loading: false,
                content: response[fieldName].aiOutput,
              })

              await this.botMessage(nextBotMessage)
            } else {
              // Show next message without further delay
              this.botui.message.update(index, {
                loading: false,
                content: nextBotMessage,
              })
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
