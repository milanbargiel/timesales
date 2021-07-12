// Import conversation branches
import HoldOn from '../conversation/holdOn.js'
import AmountOfTime from '../conversation/amountOfTime.js'

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
      const str = text.toLowerCase()

      // Word stems with porter stemmer
      // https://9ol.es/porter_js_demo.html
      const list = [
        'futur',
        'social media',
        'travel',
        'love',
        'distract',
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

      const keyword = list.find((stem) => str.includes(stem))

      let reply

      switch (keyword) {
        case 'futur':
          reply =
            'That is the best investment you could have made: we need more people like you.'
          break
        case 'social media':
          reply =
            "You don't need time for that. But I'll sell it to you anyways."
          break
        case 'travel':
          reply = 'Good choice, but keep the environment in mind.'
          break
        case 'love':
          reply = "There's nothing more beautiful than love."
          break
        case 'distract':
          reply = 'Yeah, we all need to get lost sometimes.'
          break
        case 'wast':
          reply =
            "Isn't it strange that it feels good to throw away the most precoius things we posses?"
          break
        case 'concentr':
          reply = 'Concentrated time for concentration. Here you go.'
          break
        case 'think':
          reply = "Good choice, that's one of our best selling products"
          break
        case 'eat':
          reply = 'Mmmmh, the most delicious time you can get.'
          break
        case 'celebr':
          reply = "You've earned that."
          break
        case 'buy':
          reply = "Yeah, let's boost that economy."
          break
        case 'work':
          reply = 'For work? are you sure?'
          break
        case 'play':
          reply = 'A good investment! It will help you to stay young.'
          break
        case 'art':
          reply = 'I love art'
          break
        case 'project':
          reply =
            'Cool idea, you are in the right place. This is the perfect starting point for your project'
          break
        case 'relax':
          reply = this.standardReply('relax')
          break
        case 'be by myself':
          reply = this.standardReply('be by myself')
          break
        case 'read':
          reply = this.standardReply('read')
          break
        default:
          reply = 'Excellent choice.'
          break
      }

      return reply
    },
  },
}
