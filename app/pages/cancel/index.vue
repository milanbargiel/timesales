<template>
  <div class="bot-container">
    <div id="botui">
      <bot-ui />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex' // helper for mapping vuex store mutations to methods
import Cancel from '../../conversation/cancel.js'

export default {
  mixins: [Cancel],
  data() {
    return { botui: '' }
  },
  head: {
    meta: [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow' }],
  },
  async mounted() {
    // load bot modules
    await this.$nextTick()
    this.botui = this.$botui('botui')
    this.cancelConversation()
  },
  methods: {
    ...mapMutations({
      // Enable state mutation as methods
      setResponse: 'response/setResponse',
    }),
    ...mapActions({
      postReview: 'advertisement/postReview',
      generateAiComment: 'response/generateAiComment',
    }),
  },
}
</script>
