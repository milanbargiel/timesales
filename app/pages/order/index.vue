<!-- 
Template for the order link [url]/order?key="xxx" 
Opens when a user gets redirected from checkout or clicks on the link from the success mail
-->

<template>
  <Loading v-if="isLoading" />
  <div v-else>
    <div v-if="showStream">
      <SandSimulation
        :duration="order.duration"
        :initial-progress="order.progress"
        @save-progress="handleSaveProgress"
      />
    </div>
    <div v-else class="bot-container">
      <div id="botui">
        <bot-ui />
      </div>
    </div>
  </div>
</template>

<script>
import timestring from 'timestring' // to convert time to sec for sand sim
import StreamPreamble from '../../conversation/streamPreamble.js'
import Feedback from '../../conversation/feedback.js'

export default {
  mixins: [StreamPreamble, Feedback],
  data() {
    return {
      isLoading: true,
      showStream: false,
      botui: '',
      order: {},
    }
  },
  created() {
    // Fetch order data with query parameter "key" in URL
    if (typeof this.$route.query.key === 'undefined') {
      this.$router.push('/404')
    }

    this.fetchOrder(this.$route.query.key)
  },
  methods: {
    async loadBot() {
      // load bot modules
      await this.$nextTick()
      this.botui = this.$botui('botui')
    },
    fetchOrder(key) {
      this.$axios
        .$get(`${this.$config.apiUrl}/orders/${key}`)
        .then(async (res) => {
          this.isLoading = false
          this.order = res
          this.order.duration = timestring(
            `${res.response.timeAmount} ${res.response.timeUnit}`,
            's'
          ) // sand sim need seconds
          await this.loadBot()

          if (res.progress === 0) {
            // Start feedback dialogue
            this.feedback()
          } else {
            // Start stream preamble dialogue
            this.streamPreamble()
          }
        })
        // Redirect if order was not found
        .catch((e) => {
          this.$router.push('/404')
        })
    },
    beginStream() {
      // Is fired from stream preamble dialogue
      this.showStream = true
    },
    async handleSaveProgress(progress) {
      // If time is up show feedback dialogue
      if (progress <= 0) {
        this.showStream = false
        await this.loadBot()
        this.feedback()

        // Save value in database
        this.$axios.$put(`${this.$config.apiUrl}/orders/${this.order.key}`, {
          progress: 0,
        })
      } else {
        // Save progress in db (only accepts numbers between 0 and 1)
        this.$axios.$put(`${this.$config.apiUrl}/orders/${this.order.key}`, {
          progress,
        })
      }
    },
    saveFeedback(feedback) {
      this.$axios.$post(`${this.$config.apiUrl}/feedbacks`, {
        order: this.order.id,
        opinion: feedback,
      })
    },
  },
}
</script>

<style>
canvas {
  width: 100vw;
  height: 100vh;
  image-rendering: pixelated;
}
</style>
