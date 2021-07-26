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
      // For all following set frequency
      let delay =
        index > 0
          ? (index + 1) * state.config.reviewFrequency
          : state.config.reviewFirstAppearance

      // Debug mode: Set delay to 0 when showAllPopUps is activated in backend
      delay = state.config.showAllPopUps ? 0 : delay

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
      // For first element set delay of purchaseFirstAppearance
      // For all following set frequency
      let delay =
        index > 0
          ? (index + 1) * state.config.purchaseFrequency
          : state.config.purchaseFirstAppearance

      // Debug mode: Set delay to 0 when showAllPopUps is activated in backend
      delay = state.config.showAllPopUps ? 0 : delay

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
      // For first element set delay of purchaseFirstAppearance
      // For all following set frequency
      let delay =
        index > 0
          ? (index + 1) * state.config.popUpFrequency
          : state.config.popUpFirstAppearance

      // Debug mode: Set delay to 0 when showAllPopUps is activated in backend
      delay = state.config.showAllPopUps ? 0 : delay

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
