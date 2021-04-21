<template>
  <div @click="toggle">
    <div class="container">
      <div>
        <div id="botui">
          <bot-ui />
        </div>
        <b-button v-if="showCheckoutButton" @click="checkout(order)"
          >Proceed to checkout</b-button
        >
      </div>
    </div>
    <div class="controls">
      <span class="pause-button" @click="checkout(dummyOrder)"
        >Test Checkout</span
      >
    </div>
  </div>
</template>

<script>
import Start from '../conversation/start.js'
import stripeCheckoutMixin from '../mixins/stripeCheckoutMixin.js'

export default {
  mixins: [Start, stripeCheckoutMixin],
  data() {
    return {
      botui: '',
      showCheckoutButton: false,
      // realorder
      order: {
        name: '',
        email: 'luciano.karuso@googlemail.com', // dummy email for now
        time: 0, // in seconds
        price: 0, // in cents
        description: '',
      },
      // dummy data
      dummyOrder: {
        name: 'Luciano Karuso',
        email: 'luciano.karuso@googlemail.com',
        time: 120, // 2min
        price: 12220, // 122,20 €
        description: 'Time to meet with my mom',
      },
    }
  },
  async mounted() {
    // load bot modules
    await this.$nextTick()
    this.botui = this.$botui('botui')
    this.startConversation()
  },
  methods: {
    toggle() {
      // TODO: Implement that fast forwards delay processes on click
    },
  },
}
</script>
