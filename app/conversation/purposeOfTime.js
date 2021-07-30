// Import conversation branches
import HoldOn from '../conversation/holdOn.js'
import AmountOfTime from '../conversation/amountOfTime.js'
const stemmer = require('porter-stemmer-english')

export default {
  mixins: [HoldOn, AmountOfTime],
  methods: {
    async purposeOfTime() {
      await this.botTextInput('Your answer').then((timePurpose) => {
        this.saveResponse({ timePurpose })
      })

      await this.botMessage(this.keywordReply(this.response.timePurpose))

      // When in short checkout go directly to amount of time dialogue
      // Else, first show hold On dialogue
      if (this.shortCheckout) {
        await this.botMessage('How much time shall it be?')
        this.amountOfTime()
      } else {
        this.holdOn()
      }
    },
    standardReply(keyword) {
      return `Ah good choice, I like to ${keyword} too.`
    },
    keywordReply(text) {
      // Word stems with porter stemmer (only if applicable) e.g. Netlfix stays as it is
      // https://9ol.es/porter_js_demo.html
      const list = [
        'futur',
        'social media',
        'netlfix',
        'instagram',
        'tiktok',
        'travel',
        'love',
        'distract',
        'dispers',
        'chill',
        'wast',
        'concentr',
        'think',
        'eat',
        'celebr',
        'buy',
        'work',
        'play',
        'art',
        'project',
        'relax',
        'be by myself',
        'read',
      ]

      let str = stemmer(text.toLowerCase())
      // Add whitespace to the beginning of the String to allow for searching complete words only
      str = ' ' + str

      // Return fist keyword that is found in answer text
      const keyword = list.find((stem) => str.includes(` ${stem}`))

      let reply

      if (keyword === 'futur') {
        reply =
          'The future, excellent, that’s the best possible investment. We need more people like you.'
      } else if (
        keyword === 'social media' ||
        keyword === 'netflix' ||
        keyword === 'instagram' ||
        keyword === 'tiktok'
      ) {
        reply =
          "You don't need more time for that. But, if you insist, I'll sell it to you anyway."
      } else if (keyword === 'travel') {
        reply = 'Good choice, but please keep the environment in mind.'
      } else if (keyword === 'love') {
        reply = "There's nothing more beautiful than love."
      } else if (
        keyword === 'distract' ||
        keyword === 'dispers' ||
        keyword === 'chill'
      ) {
        reply = 'Yeah, we all need to get lost sometimes.'
      } else if (keyword === 'wast') {
        reply =
          "Isn't it strange that it feels good to throw away the most precious things we possess?"
      } else if (keyword === 'concentr') {
        reply = 'Concentrated time for concentration. Here you go.'
      } else if (keyword === 'think') {
        reply = "Good choice, that's one of our best selling products."
      } else if (keyword === 'eat') {
        reply = 'Mmmmh, the most delicious time on our menu.'
      } else if (keyword === 'celebr') {
        reply = "You've earned that."
      } else if (keyword === 'buy') {
        reply = "Yeah, let's boost that economy."
      } else if (keyword === 'work') {
        reply = 'For work? Are you sure?'
      } else if (keyword === 'play') {
        reply = 'A good investment! It will help you to stay young.'
      } else if (keyword === 'art') {
        reply = 'I love art!'
      } else if (keyword === 'project') {
        reply =
          'Cool idea, you are in the right place. This is the perfect starting point for your project'
      } else if (
        keyword === 'relax' ||
        keyword === 'be by myself' ||
        keyword === 'read'
      ) {
        reply = this.standardReply(keyword)
      } else {
        reply = 'Excellent choice.'
      }

      return reply
    },
  },
}
