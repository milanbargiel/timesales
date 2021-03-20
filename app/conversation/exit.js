export default {
  methods: {
    async exitConversation() {
      await this.botMessage('Goodbye then.')
    },
  },
}
