<template>
  <div class="time-container">
    <div class="bot-container">
      <div id="botui">
        <bot-ui />
      </div>
      <div :class="{ hidden: !showCheckoutButton }">
        <b-button @click="checkout(order)">Proceed to checkout</b-button>
      </div>
    </div>
    <div class="controls controls--top">
      <b-field class="debug-button">
        <b-switch v-model="debugMode">Fast</b-switch>
      </b-field>
    </div>
    <div class="controls controls--bottom">
      <span class="text-button" @click="checkout(dummyOrder)"
        >Test Checkout</span
      >
    </div>
  </div>
</template>

<script>
import Welcome from '../conversation/welcome.js'
import stripeCheckoutMixin from '../mixins/stripeCheckoutMixin.js'

export default {
  mixins: [Welcome, stripeCheckoutMixin],
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
      },
      // realorder
      order: {
        name: '',
        time: 0, // in seconds
        price: 0, // in cents
        description: '',
      },
      // dummyorder
      dummyOrder: {
        name: 'Luciano Karuso',
        time: 120, // in seconds
        price: 100, // in cents
        description: 'Time to meet with my mom.',
      },
    }
  },
  async mounted() {
    // load bot modules
    await this.$nextTick()
    this.botui = this.$botui('botui')
    this.welcome()
  },
}
</script>
