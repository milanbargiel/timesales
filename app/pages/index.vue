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
      debugMode: false, // In debug mode all delay is set to 0
      // realorder
      order: {
        name: '',
        time: 0, // in seconds
        price: 0, // in cents
        description: '',
      },
    }
  },
  async mounted() {
    // load bot modules
    await this.$nextTick()
    this.botui = this.$botui('botui')
    this.startConversation()
  },
}
</script>
