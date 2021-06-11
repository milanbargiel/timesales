<template>
  <div class="time-container">
    <div class="bot-container">
      <div id="botui">
        <bot-ui />
      </div>
      <div :class="{ hidden: !showCheckoutButton }">
        <b-button @click="stripeCheckout()">Proceed to checkout</b-button>
      </div>
    </div>
    <div class="controls controls--top">
      <b-field class="debug-button">
        <b-switch v-model="debugMode">Fast</b-switch>
      </b-field>
      <span class="text-button" @click="stripeCheckout()">Test Checkout</span>
    </div>
    <div class="controls controls--bottom">
      <span class="text-button" @click="checkoutBranch()">Checkout</span>
    </div>
  </div>
</template>

<script>
import Welcome from '../conversation/welcome.js'
import Checkout from '../conversation/checkout.js'

export default {
  mixins: [Welcome, Checkout],
  data() {
    return {
      botui: '',
      showCheckoutButton: false,
      debugMode: false, // In debug mode all delay is set to 0
      // Response data
      d: {
        name: '',
        allowRecording: false,
        shortOnTime: '',
        becauseOfCapitalism: '',
        timeType: '',
        timeAmount: '',
        timePrice: '',
        memberOfChurch: '',
        afraidOfHell: '',
        timeManagementSecret: '',
        readyForInvestment: '',
      },
    }
  },
  async mounted() {
    // load bot modules
    await this.$nextTick()
    this.botui = this.$botui('botui')
    this.welcome()

    // load stripe
    this.stripe = Stripe(this.$config.stripePublishableKey)
  },
  methods: {
    populateWithDummyData() {
      this.d = {
        name: 'Luciano Karuso',
        timeType: 'Read a book with my mom',
        timeAmount: 120, // in seconds
        timePrice: 100, // in cents
      }
    },
    deletePreviousConversation() {
      // Remove HTML content
      document.querySelector('.botui-messages-container').innerHTML = ''
    },
    checkoutBranch() {
      this.deletePreviousConversation()
      this.populateWithDummyData()
      // Directly go to checkout dialogue
      this.checkout()
    },
    stripeCheckout() {
      // Populate with dummy data if necessary
      if (!this.d.name) {
        this.populateWithDummyData()
      }

      const data = {
        ...this.d,
        successUrl: `${this.$config.baseUrl}/order`,
        cancelUrl: `${this.$config.baseUrl}/cancel`,
      }
      // Redirect to Stripe Checkout page
      this.$axios
        .$post(`${this.$config.apiUrl}/create-checkout-session`, data)
        .then((session) => {
          this.stripe.redirectToCheckout({ sessionId: session.id })
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },
  },
}
</script>
