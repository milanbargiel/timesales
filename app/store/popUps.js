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
    minTimeToLive: null,
    maxTimeToLive: null,
    showAllPopUps: false,
  },
  // Determine wether the page is visible and the browser window is active
  // Gets triggered by an event listener from the layout component
  // Pop-ups only appear when the page is visible
  pageVisible: true,
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
  pageVisible(state) {
    // Prevent double execution
    if (state.pageVisible === true) {
      return
    }
    state.pageVisible = true
  },
  pageInvisible(state) {
    // Prevent double execution
    if (state.pageVisible === false) {
      return
    }
    state.pageVisible = false
  },
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
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

    reviews = reviews
      .map((item) => ({ sort: Math.random(), value: item })) // introduce random sort parameter
      .sort((a, b) => a.sort - b.sort) // sort by random sort parameter
      .map((item) => item.value) // delete random sort parameter
      .map((item, index) => {
        // For first element set delay of reviewFirstAppearance
        // For all following set frequency
        let delay =
          index > 0
            ? (index + 1) * state.config.reviewFrequency
            : state.config.reviewFirstAppearance

        // Debug mode: Set delay to 0 when showAllPopUps is activated in backend
        delay = state.config.showAllPopUps ? 0 : delay

        // Calculate random time to live
        const ttl = getRandomInt(
          state.config.minTimeToLive,
          state.config.maxTimeToLive
        )

        return {
          text: item.opinion,
          author: item.fakeAuthor,
          delay,
          ttl,
        }
      })
    commit('setReviews', reviews)
  },
  async fetchPurchases({ commit, state }) {
    let purchases = await this.$axios.$get(`${this.$config.apiUrl}/purchases`)
    purchases = purchases
      .map((item) => ({ sort: Math.random(), value: item })) // introduce random sort parameter
      .sort((a, b) => a.sort - b.sort) // sort by random sort parameter
      .map((item) => item.value) // delete random sort parameter
      .map((item, index) => {
        // For first element set delay of purchaseFirstAppearance
        // For all following set frequency
        let delay =
          index > 0
            ? (index + 1) * state.config.purchaseFrequency
            : state.config.purchaseFirstAppearance

        // Debug mode: Set delay to 0 when showAllPopUps is activated in backend
        delay = state.config.showAllPopUps ? 0 : delay

        // Calculate random time to live
        const ttl = getRandomInt(
          state.config.minTimeToLive,
          state.config.maxTimeToLive
        )

        return {
          text: item.text,
          delay,
          ttl,
        }
      })
    commit('setPurchases', purchases)
  },
  async fetchPopUps({ commit, state }) {
    let popUps = await this.$axios.$get(`${this.$config.apiUrl}/pop-ups`)
    popUps = popUps
      .map((item) => ({ sort: Math.random(), value: item })) // introduce random sort parameter
      .sort((a, b) => a.sort - b.sort) // sort by random sort parameter
      .map((item) => item.value) // delete random sort parameter
      .map((item, index) => {
        // For first element set delay of purchaseFirstAppearance
        // For all following set frequency
        let delay =
          index > 0
            ? (index + 1) * state.config.popUpFrequency
            : state.config.popUpFirstAppearance

        // Debug mode: Set delay to 0 when showAllPopUps is activated in backend
        delay = state.config.showAllPopUps ? 0 : delay

        // Calculate random time to live
        const ttl = getRandomInt(
          state.config.minTimeToLive,
          state.config.maxTimeToLive
        )

        return {
          imageUrl: item.image.url,
          delay,
          ttl,
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
