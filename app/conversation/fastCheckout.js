export default {
  methods: {
    async fastCheckout(minutes, price) {
      await this.botMessage(
        `sweet, you chose to buy ${minutes} minutes for ${price} €.`
      )

      const pay = await this.botui.action.button({
        action: [
          {
            text: 'Buy time',
          },
        ],
      })
      if (pay) {
        alert(`Congratulations. You bought ${minutes} minutes for ${price} € !`)
      }
    },
  },
}
