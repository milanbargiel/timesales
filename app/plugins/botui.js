import vue from 'vue'
import Botui from 'botui'

vue.mixin({
  methods: {
    lookForKeyword(text) {
      // verb infinitives work fine in the answers
      // returns first word that is found in list
      const str = text.toLowerCase()
      const list = ['think', 'relax', 'be by myself', 'work', 'read']
      return list.find((word) => str.includes(word))
    },
    timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    timeToWrite(sentence) {
      // Calculate time for bot to write a message
      // Min value is 2 seconds
      return Math.max(sentence.length * 50, 2000)
    },
    botMessage(content, customDelay) {
      return this.botui.message.add({
        delay: customDelay || this.timeToWrite(content),
        loading: true,
        type: 'html',
        content,
      })
    },
    botYesOrNo() {
      return this.botui.action.button({
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
    },
  },
})

export default ({ app }, inject) => {
  // Inject $botui(selector) in Vue, context and store.
  inject('botui', (selector) => new Botui(selector, { vue }))
}
