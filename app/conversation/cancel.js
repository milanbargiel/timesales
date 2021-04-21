export default {
  methods: {
    async cancelConversation() {
      await this.botMessage('Are you afraid of buying time?')
      await this.botMessage('Goodybe then.')
    },
  },
}
