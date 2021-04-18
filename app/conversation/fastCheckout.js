export default {
  methods: {
    async fastCheckout(minutes, price) {
      await this.botMessage(
        `sweet, you chose to buy ${minutes} minutes for ${price} €.`
      )
    },
  },
}
