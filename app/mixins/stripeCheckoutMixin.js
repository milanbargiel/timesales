export default {
  methods: {
    checkout(orderData) {
      const data = {
        ...orderData,
        successUrl: `${this.$config.baseUrl}/order`,
        cancelUrl: `${this.$config.baseUrl}/cancel`,
      }
      // Redirect to Stripe Checkout page
      this.$axios
        .$post(`${this.$config.apiUrl}/create-checkout-session`, data)
        .then((session) => {
          this.stripe.redirectToCheckout({ sessionId: session.id })
        })
        .then((result) => {
          // If `redirectToCheckout` fails due to a browser or network
          // error, you should display the localized error message to your
          // customer using `error.message`.
          console.log(result)

          if (result.error) {
            alert(result.error.message)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },
  },
  mounted() {
    this.stripe = Stripe(this.$config.stripePublishableKey)
  },
}
