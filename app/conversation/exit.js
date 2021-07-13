export default {
  methods: {
    async exit() {
      await this.botMessage('Goodbye then.')

      this.botui.action
        .button({
          action: [
            {
              text: 'Take me back to where it all began',
            },
          ],
        })
        .then(() => {
          // Reloads the component
          this.$router.go()
        })
    },
  },
}
