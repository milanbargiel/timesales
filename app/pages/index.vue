<template>
  <div class="tsl">
    <div class="bot-container">
      <div id="botui">
        <bot-ui />
      </div>
      <div :class="{ hidden: !showCheckoutButton }">
        <button class="button" @click="stripeCheckout()">
          Proceed to checkout
        </button>
        <p class="help">
          By clicking on the button "Proceed to checkout" you agree to our
          privacy policy.
        </p>
      </div>
    </div>
    <footer class="footer">
      <div class="navigation">
        <a href="#">Imprint</a>
        <a href="#">Data privacy</a>
        <a href="#">Terms and conditions</a>
      </div>
      <div class="creators">
        <a class="underlined-link" href="#">Milan Bargiel</a>
        <a class="underlined-link" href="#">Ludwig Lederer</a>
        <a class="underlined-link" href="#">Katherina Gorodynska</a>
        <img
          class="patron-logo"
          src="~/assets/lab-k-nrw.svg"
          alt="Landesbüro für Bildende Kunst (LaB K)"
        />
      </div>
    </footer>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex' // helper for mapping vuex store mutations to methods
import Welcome from '../conversation/welcome.js'
import Checkout from '../conversation/checkout.js'

export default {
  mixins: [Welcome, Checkout],
  data() {
    return {
      botui: '',
      showCheckoutButton: false,
      debugMode: false, // In debug mode all delay is set to 0
      shortCheckout: false,
    }
  },
  computed: {
    response() {
      return this.$store.state.response.data
    },
  },
  async mounted() {
    // load bot modules
    await this.$nextTick()
    this.botui = this.$botui('botui')

    // Reset vuex store every time component is loaded
    // By doing so it is assured that stale data is not going to be stored in the database after a page refresh
    this.resetState()

    if (typeof this.$route.query.shortCheckout === 'undefined') {
      // Start welcome dialogue
      this.welcome()
    } else {
      // Start short checkout
      this.shortCheckout = true
      await this.botMessage('What would you like to have time for?')
      this.purposeOfTime()
    }

    // load stripe
    this.stripe = Stripe(this.$config.stripePublishableKey)
  },
  methods: {
    ...mapMutations({
      // Enables this.resetState()
      resetState: 'response/resetState',
    }),
    ...mapActions({
      // Enables the action this.saveResponse({ key: value })
      // That saves data in vuex store and on remote databe if user opts in
      saveResponse: 'response/saveResponse',
    }),
    populateWithDummyData() {
      this.saveResponse({
        name: 'Luciano Karuso',
        timePurpose: 'Read a book with my mom',
        timeAmount: 120,
        timeUnit: 'seconds',
        timePrice: 100, // in cents
        orderSummary: '200 seconds to read a book with my mom',
      })
    },
    stripeCheckout() {
      // Populate with dummy data if necessary
      if (!this.response.name && !this.response.timePurpose) {
        this.populateWithDummyData()
      }

      const data = {
        ...this.response,
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
