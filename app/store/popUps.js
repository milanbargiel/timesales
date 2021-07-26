const state = () => ({
  reviews: [],
  purchases: [],
  popUps: [],
  config: {
    reviewFirstAppearance: null, // in seconds
    reviewFrequency: null,
    purchaseFirstAppearance: null,
    purchaseFrequency: null,
    popUpFirstAppearance: null,
    popUpFrequency: null,
    showAllPopUps: false,
  },
})

const mutations = {
  setReviews(state, reviews) {
    state.reviews = reviews
  },
  setPurchases(state, purchases) {
    state.purchases = purchases
  },
  setPopUps(state, popUps) {
    state.popUps = popUps
  },
  setConfig(state, config) {
    state.config = config
  },
}

const actions = {
  fetchAllPopUpData({ commit, dispatch }) {
    dispatch('fetchConfig').then(() => {
      // Use .then() to wait for async dispatch function
      dispatch('fetchReviews')
      dispatch('fetchPurchases')
      dispatch('fetchPopUps')
    })
  },
  async fetchReviews({ commit, state }) {
    let reviews = await this.$axios.$get(`${this.$config.apiUrl}/feedbacks`)
    reviews = reviews.map((item, index) => {
      // For first element set delay of reviewFirstAppearance
      let delay = state.config.reviewFirstAppearance

      // For all following set frequency
      if (index > 0) {
        delay = state.config.reviewFrequency
      } else if (state.showAllPopUps || !delay) {
        // Debug mode or not set
        delay = 0
      }

      return {
        text: item.opinion,
        author: item.fakeAuthor,
        delay,
      }
    })
    commit('setReviews', reviews)
  },
  async fetchPurchases({ commit, state }) {
    let purchases = await this.$axios.$get(`${this.$config.apiUrl}/purchases`)
    purchases = purchases.map((item, index) => {
      // For first element set delay of reviewFirstAppearance
      let delay = state.config.purchaseFirstAppearance

      // For all following set frequency
      if (index > 0) {
        delay = state.config.purchaseFrequency
      } else if (state.showAllPopUps || !delay) {
        // Debug mode or not set
        delay = 0
      }

      return {
        text: item.text,
        delay,
      }
    })
    commit('setPurchases', purchases)
  },
  async fetchPopUps({ commit, state }) {
    let popUps = await this.$axios.$get(`${this.$config.apiUrl}/pop-ups`)
    popUps = popUps.map((item, index) => {
      // For first element set delay of reviewFirstAppearance
      let delay = state.config.popUpFirstAppearance

      // For all following set frequency
      if (index > 0) {
        delay = state.config.popUpFrequency
      } else if (state.showAllPopUps || !delay) {
        // Debug mode or not set
        delay = 0
      }

      return {
        imageUrl: item.image.url,
        delay,
      }
    })
    commit('setPopUps', popUps)
  },
  async fetchConfig({ commit }) {
    const config = await this.$axios.$get(`${this.$config.apiUrl}/config`)
    commit('setConfig', config)
  },
}

export default {
  state,
  mutations,
  actions,
}
