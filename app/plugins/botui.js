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
      // No delays in debug mode
      if(this.debugMode) {
        return Promise.resolve()
      }

      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    timeToWrite(sentence) {
      // No delays in debug mode
      if(this.debugMode) {
        return 100
      }

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
    async botTextInput(placeholder) {
      const res = await this.botui.action.text({
        action: {
          placeholder,
        },
      }) 
      return res.value // only return value property
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
      const domElement = this.$el.querySelector('.botui-message-content.loading')
      
      // Hide parent node
      if (domElement) {
        domElement.parentNode.style.display = 'none'
      }
    }
  },
})

export default ({ app }, inject) => {
  // Inject $botui(selector) in Vue, context and store.
  inject('botui', (selector) => new Botui(selector, { vue }))
}
