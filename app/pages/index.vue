<template>
  <div class="centered-content">
    <!-- Components are auto imported by nuxt-->
    <Reviews :data="reviews" />
    <PopUps :data="popUps" />
    <!-- Bot Conversation-->
    <div class="bot-container">
      <div id="botui">
        <bot-ui />
      </div>
      <div v-if="showPrivacyInfo">
        <p class="help">
          By clicking "no" we only save data relevant to the order. For futher
          details please refer to our
          <a href="/data-privacy" target="_blank">privacy policy</a>.
        </p>
      </div>
      <div v-if="showTaxInfo">
        <p class="help">Keep in mind that 7% VAT will be added on checkout.</p>
      </div>
      <div v-if="showCheckoutButton">
        <!-- eslint-disable vue/no-v-html -->
        <div class="order-summary" v-html="orderSummaryHtml"></div>
        <button class="button" @click="stripeCheckout()">
          Proceed to checkout
        </button>
        <p class="help">
          By clicking on the button "Proceed to checkout" you agree to our
          <a href="/data-privacy" target="_blank">privacy policy</a>.
        </p>
      </div>
    </div>
    <Purchases :data="purchases" />
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
      showPrivacyInfo: false,
      showTaxInfo: false,
    }
  },
  computed: {
    response() {
      return this.$store.state.response.data
    },
    debugMode() {
      return this.$store.state.ui.debugMode // In debug mode all delay is set to 0
    },
    reviews() {
      return this.$store.state.popUps.reviews
    },
    purchases() {
      return this.$store.state.popUps.purchases
    },
    popUps() {
      return this.$store.state.popUps.popUps
    },
    orderSummaryHtml() {
      const words = this.response.orderSummary.split(' ')
      const timeString = words.slice(0, 2).join(' ')
      const timeDescription = words.slice(2).join(' ')
      const tax = Math.round(this.response.timePrice * 0.07) // 7% tax rounded to decimals
      let timePrice = (this.response.timePrice + tax) / 100

      // Convert to EUR currency String
      timePrice = timePrice.toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR',
      })

      const html = `<span class="special-font">${timeString}</span> ${timeDescription} <span class="special-font">for ${timePrice.toLocaleString()}</span>`
      return html
    },
  },
  created() {
    // Trigger vuex action that loads all data from backend
    this.getAllPopUpData()
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
      // Enables the action this.saveResponse({ key: value }) and this.getAllPopUpData()
      // That saves data in vuex store and on remote databe if user opts in
      saveResponse: 'response/saveResponse',
      getAllPopUpData: 'popUps/fetchAllPopUpData',
    }),
    stripeCheckout() {
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
