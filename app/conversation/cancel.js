export default {
  methods: {
    async cancel() {
      await this.botMessage('Are you afraid of buying time?')
      await this.botMessage('Goodybe then.')
    },
  },
}
