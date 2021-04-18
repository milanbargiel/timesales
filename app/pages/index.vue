<template>
  <div class="container" @click="toggle">
    <div>
      <div id="botui">
        <bot-ui />
      </div>
      <button id="checkout-button" @click="checkout(order)">Buy time</button>
    </div>
  </div>
</template>

<script>
// import Start from '../conversation/start.js'
import FastCheckout from '../conversation/fastCheckout.js'
import stripeCheckoutMixin from '../mixins/stripeCheckoutMixin.js'

export default {
  mixins: [FastCheckout, stripeCheckoutMixin],
  data() {
    return {
      botui: '',
      // dummy data
      order: {
        email: 'luciano.karuso@googlemail.com',
        time: 2000,
        name: 'Luciano Karuso',
        price: 12220,
        description: 'Time to meet with my moms',
      },
    }
  },
  async mounted() {
    // load bot modules
    await this.$nextTick()
    this.botui = this.$botui('botui')
    this.fastCheckout(10, 100)
  },
  methods: {
    toggle() {
      // TODO: Implement that fast forwards delay processes on click
    },
  },
}
</script>
