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
    showAllAdvertisements: false,
  },
  // Determine wether the page is visible and the browser window is active
  // Gets triggered by an event listener from the layout component
  // Pop-ups only appear when the page is visible
  pageVisible: true,
})

const mutations = {
  setReviews(state, reviews) {
    // Shuffle the reviews before storing them
    const shuffledReviews = reviews
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

        // Debug mode: Set delay to 0 when showAllAdvertisements is activated in backend
        delay = state.config.showAllAdvertisements ? 0 : delay

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
    state.reviews = shuffledReviews
  },
  setPurchases(state, purchases) {
    const shuffledPurchases = purchases
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

        // Debug mode: Set delay to 0 when showAllAdvertisements is activated in backend
        delay = state.config.showAllAdvertisements ? 0 : delay

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
    state.purchases = shuffledPurchases
  },
  setPopUps(state, popUps) {
    const shuffledPopUps = popUps
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

        // Debug mode: Set delay to 0 when showAllAdvertisements is activated in backend
        delay = state.config.showAllAdvertisements ? 0 : delay

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
    state.popUps = shuffledPopUps
  },
  setConfig(state, config) {
    state.config = {
      reviewFirstAppearance: config.reviewFirstAppearance,
      reviewFrequency: config.reviewFrequency,
      purchaseFirstAppearance: config.purchaseFirstAppearance,
      purchaseFrequency: config.purchaseFrequency,
      popUpFirstAppearance: config.popUpFirstAppearance,
      popUpFrequency: config.popUpFrequency,
      minTimeToLive: config.minTimeToLive,
      maxTimeToLive: config.maxTimeToLive,
      showAllAdvertisements: config.showAllAdvertisements,
    }
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
  fetchAdvertisementData({ commit }) {
    this.$axios.$get(`${this.$config.apiUrl}/advertisement`).then((data) => {
      commit('setConfig', data)
      commit('setReviews', data.reviews)
      commit('setPurchases', data.purchases)
      commit('setPopUps', data.popUps)
    })
  },
  postReview({ rootState }, review) {
    // Post review to the backend
    // Do not write it to store, it is not so important that review data is always fresh
    return this.$axios.post(`${this.$config.apiUrl}/create-review`, {
      // When a response exists, connect it to the review
      ...(rootState.response.data.id && {
        responseId: rootState.response.data.id,
      }),
      opinion: review,
    })
  },
}

export default {
  state,
  mutations,
  actions,
}
