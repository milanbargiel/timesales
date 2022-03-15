<!-- 
Template for the order link [url]/order?key="xxx" 
Opens when a user gets redirected from checkout or clicks on the link from the success mail
-->

<template>
  <div class="centered-content">
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
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex' // helper for mapping vuex store mutations to methods
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
  head: {
    meta: [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow' }],
  },
  created() {
    this.fetchOrder(this.$route.query.key)
  },
  methods: {
    ...mapMutations({
      // Enable state mutation as methods
      showFooter: 'ui/showFooter',
      hideFooter: 'ui/hideFooter',
      showHeader: 'ui/showHeader',
      hideHeader: 'ui/hideHeader',
      setResponse: 'response/setResponse',
    }),
    ...mapActions({
      postReview: 'advertisement/postReview',
      generateAiComment: 'response/generateAiComment',
    }),
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

          // set response id in vuexstore to connect feedback to response when given
          this.setResponse({ id: res.response.id })

          await this.loadBot()

          if (res.progress === 0) {
            // Start feedback dialogue
            await this.botMessage(
              'You have already spent your time. Did you enjoy it?'
            )

            await this.botMessage(
              'Please leave your thoughts, remarks, and suggestions. (We reserve the right to use them anonymously)'
            )

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
      // Do not show header and footer when sand sim runs
      this.hideHeader()
      this.hideFooter()
    },
    async handleSaveProgress(progress) {
      // If time is up show feedback dialogue
      if (progress <= 0) {
        this.showStream = false
        this.showHeader()
        this.showFooter()
        await this.loadBot()
        // Start feedback dialogue
        await this.botMessage('Did you enjoy your time?')
        this.feedback()

        // Save value in database
        this.$axios.$put(
          `${this.$config.apiUrl}/update-stream-progress/${this.order.key}`,
          {
            progress: 0,
          }
        )
      } else {
        // Save progress in db (only accepts numbers between 0 and 1)
        this.$axios.$put(
          `${this.$config.apiUrl}/update-stream-progress/${this.order.key}`,
          {
            progress,
          }
        )
      }
    },
  },
}
</script>
