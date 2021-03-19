import vue from 'vue'
import Botui from 'botui'

vue.mixin({
  methods: {
    timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    botMessage(content) {
      return this.botui.message.add({
        delay: 2000,
        loading: true,
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
