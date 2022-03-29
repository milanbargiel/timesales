<template>
  <div ref="entirePage" class="centered-content">
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
        <button
          class="button"
          :disabled="checkoutIsLoading"
          @click="stripeCheckout()"
        >
          Proceed to checkout
        </button>
        <div class="checkbox-container">
          <label class="checkbox">
            <input v-model="userWishesInvoice" type="checkbox" />
            I wish to receive the invoice by postal mail.
          </label>
        </div>
        <p v-if="showCheckoutError" class="error">
          There is a problem with your order. Please retry and send an E-Mail to
          <a href="mailto:hello@timesales.ltd">hello@timesales.ltd</a> if you
          keep facing this issue.
        </p>
        <p v-else class="help">
          By clicking on the button "Proceed to checkout" I agree to the
          <a href="/terms-and-conditions" target="_blank"
            >Terms and conditions</a
          >
          and the <a href="/data-privacy" target="_blank">privacy policy</a> of
          Time Sales Online. I hereby confirm that Time Sales Online shall
          commence with the execution of the contract before the expiration of
          the withdrawal period. Furthermore I confirm that I am aware of the
          fact that my right of withdrawal expires with the conclusion of the
          purchase contract.
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
      userWishesInvoice: false, // The user wishes to receive an inbox via postal mail
      checkoutIsLoading: false, // to disable checkout button during the loading of the Stripe script
      showCheckoutError: false,
      showPrivacyInfo: false,
      showTaxInfo: false,
    }
  },
  computed: {
    response() {
      return this.$store.state.response.data
    },
    aiConfig() {
      // expose aiConfig
      return this.$store.state.config.aiConfig
    },
    debugMode() {
      return this.$store.state.ui.debugMode
    },
    reviews() {
      return this.$store.state.advertisement.reviews
    },
    purchases() {
      return this.$store.state.advertisement.purchases
    },
    popUps() {
      return this.$store.state.advertisement.popUps
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
    // Trigger vuex action that loads advertisements from the backend
    this.getAdvertisementData()
  },
  async mounted() {
    // load bot modules
    await this.$nextTick()
    this.botui = this.$botui('botui')

    // Reset vuex store every time component is loaded
    // By doing so it is assured that stale data is not going to be stored in the database after a page refresh
    this.resetState()

    // In debug mode all delay is set to 0
    if (typeof this.$route.query.debugMode !== 'undefined') {
      this.enableDebugMode()
    }

    if (typeof this.$route.query.shortCheckout === 'undefined') {
      // Start welcome dialogue
      this.welcome()
    } else {
      // Start short checkout
      this.shortCheckout = true
      await this.botMessage('What would you like to have time for?')
      this.purposeOfTime()
    }
  },
  methods: {
    ...mapMutations({
      // Enables this.resetState()
      resetState: 'response/resetState',
      enableDebugMode: 'ui/enableDebugMode',
    }),
    ...mapActions({
      // Enables actions for saving responses, generating ai comments and retrieving advertisement data from the api
      // Actions are defined in the vuex store
      saveResponse: 'response/saveResponse',
      generateAiComment: 'response/generateAiComment',
      getAdvertisementData: 'advertisement/fetchAdvertisementData',
      postReview: 'advertisement/postReview',
    }),
    stripeCheckout() {
      // Only load stripe script when user clicks on checkout button.
      this.checkoutIsLoading = true // Disable checkout button & show loading spinner while script is loading.
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3'
      script.defer = 'true'
      document.head.appendChild(script)

      // When script is loaded, continue.
      script.onload = () => {
        this.stripe = Stripe(this.$config.stripePublishableKey)

        const data = {
          ...this.response,
          userWishesInvoice: this.userWishesInvoice,
          successUrl: `${this.$config.baseUrl}/order`,
          cancelUrl: `${this.$config.baseUrl}/cancel`,
        }
        // Redirect to Stripe Checkout page
        this.$axios
          .$post(`${this.$config.apiUrl}/create-stripe-checkout-session`, data)
          .then((session) => {
            this.stripe.redirectToCheckout({ sessionId: session.id })
          })
          .catch(() => {
            // On error reenable the checkoutbutton
            this.checkoutIsLoading = false
            this.showCheckoutError = true
          })
      }

      script.onerror = () => {
        // On error reenable the checkoutbutton
        this.checkoutIsLoading = false
        this.showCheckoutError = true
      }
    },
    scrollToBottom() {
      // Triggered by checkout
      const pageHeight = this.$refs.entirePage.clientHeight
      window.scrollTo(0, pageHeight)
    },
    // Helper function for replacing pronouns in the 'checkout' and 'timePurpose' branch
    replacePersonalPronouns(userInput) {
      let processedInput = userInput
      processedInput = processedInput.replace(/\b(my)\b/i, 'your')
      processedInput = processedInput.replace(/\b(myself)\b/i, 'yourself')
      processedInput = processedInput.replace(/\b(me)\b/i, 'yourself')
      processedInput = processedInput.replace(
        /\b(you)\b/i,
        'the Time Sales bot'
      )
      processedInput = processedInput.replace(/\b(i)\b/i, 'you')
      return processedInput
    },
  },
}
</script>
