<template>
  <div @click="toggle">
    <div class="container">
      <div>
        <div id="botui">
          <bot-ui />
        </div>
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
      // dummy data
      dummyOrder: {
        email: 'luciano.karuso@googlemail.com',
        time: 2000,
        name: 'Luciano Karuso',
        price: 12220,
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
