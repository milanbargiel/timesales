<template>
  <div class="content">
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex' // helper for mapping vuex store mutations to methods

export default {
  created() {
    // Get timeout data for ai an config for the bot
    this.getConfigData()
  },
  mounted() {
    // Get viewport height to calculate the vertical position of pop-ups
    // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`)

    window.addEventListener('resize', () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })

    // Check if page is visible (tab is active)
    // Add focus and blur eventlistener to to toglle visibilitychange when browser window is inactive
    // https://stackoverflow.com/questions/28993157/visibilitychange-event-is-not-triggered-when-switching-program-window-with-altt
    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
      false
    )
    window.addEventListener('focus', this.handleVisibilityChange, false)
    window.addEventListener('blur', this.handleVisibilityChange, false)
  },
  methods: {
    ...mapMutations({
      pageVisible: 'advertisement/pageVisible',
      pageInvisible: 'advertisement/pageInvisible',
    }),
    ...mapActions({
      getConfigData: 'config/fetchConfigData', // Used for the gpt2api timeout
    }),
    handleVisibilityChange(event) {
      if (event.type === 'visibilitychange') {
        if (document.hidden) {
          this.pageInvisible()
        } else {
          this.pageVisible()
        }
      } else if (event.type === 'focus') {
        this.pageVisible()
      } else if (event.type === 'blur') {
        this.pageInvisible()
      }
    },
  },
}
</script>
