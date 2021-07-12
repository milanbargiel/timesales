// Import conversation branches
import HoldOn from '../conversation/holdOn.js'
import AmountOfTime from '../conversation/amountOfTime.js'

export default {
  mixins: [HoldOn, AmountOfTime],
  methods: {
    keywordReply(text) {
      const str = text.toLowerCase()
      const list = [
        'future',
        'social media',
        'travel',
        'love',
        'distraction',
        'waste',
        'concentrate',
        'think',
        'eat',
        'celebrate',
        'buy',
        'work',
        'play',
        'art',
        'project',
      ]
      const keyword = list.find((word) => str.includes(word))

      let reply

      switch (keyword) {
        case 'future':
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
        case 'distraction':
          reply = 'Yeah, we all need to get lost sometimes.'
          break
        case 'waste':
          reply =
            "Isn't it strange that it feels good to throw away the most precoius things we posses?"
          break
        case 'concentrate':
          reply = 'Concentrated time for concentration. Here you go.'
          break
        case 'think':
          reply = "Good choice, that's one of our best selling products"
          break
        case 'eat':
          reply = 'Mmmmh, the most delicious time you can get.'
          break
        case 'celebrate':
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
      }

      return reply || 'Excellent choice.'
    },
    async purposeOfTime() {
      await this.botTextInput('Your answer').then((timePurpose) => {
        this.saveResponse({ timePurpose })
      })

      // Look for predefined keywords in the description of the time needed
      const keyword = this.lookForKeyword(this.response.timePurpose)

      if (keyword) {
        await this.botMessage(`Ah good choice, I like to ${keyword} too.`)
      } else {
        await this.botMessage('Excellent choice')
      }

      // When in short checkout go directly to amount of time dialogue
      // Else, first show hold On dialogue
      if (this.shortCheckout) {
        await this.botMessage('How much time shall it be?')
        this.amountOfTime()
      } else {
        this.holdOn()
      }
    },
  },
}
