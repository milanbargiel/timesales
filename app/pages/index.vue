<template>
  <div class="tsl">
    <!-- Components are auto imported by nuxt-->
    <Reviews
      v-if="showReviews"
      :data="reviews"
      @click.native="showReviews = false"
    />
    <Header v-if="showHeader" @click.native="showHeader = false" />
    <PopUp v-if="showPopUp" :data="popUps" @click.native="showPopUp = false" />
    <!-- Bot Conversation-->
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
    <Purchases
      v-if="showPurchases"
      :data="purchases"
      @click.native="showPurchases = false"
    />
    <Footer />
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
      showHeader: false,
      showReviews: false,
      showPopUp: true,
      showPurchases: false,
      reviews: [],
      purchases: [],
      popUps: [],
    }
  },
  computed: {
    response() {
      return this.$store.state.response.data
    },
  },
  created() {
    // Load data from backend
    this.fetchReviews()
    this.fetchPurchases()
    this.fetchPopUps()
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
    fetchReviews() {
      this.$axios
        .$get(`${this.$config.apiUrl}/feedbacks`)
        .then((res) => {
          // Push backend review data to local storage
          res.forEach((item) => {
            this.reviews.push({
              text: item.opinion,
              author: item.fakeAuthor,
            })
          })
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },
    fetchPurchases() {
      this.$axios
        .$get(`${this.$config.apiUrl}/purchases`)
        .then((res) => {
          // Push backend review data to local storage
          res.forEach((item) => {
            this.purchases.push({
              text: item.text,
            })
          })
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },
    fetchPopUps() {
      this.$axios
        .$get(`${this.$config.apiUrl}/pop-ups`)
        .then((res) => {
          // Push backend review data to local storage
          res.forEach((item) => {
            this.popUps.push({
              imageUrl: item.image.url,
            })
          })
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },
  },
}
</script>
