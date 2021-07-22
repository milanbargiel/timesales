const state = () => ({
  reviews: [],
  purchases: [],
  popUps: [],
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
}

const actions = {
  getAllPopUpData({ commit, dispatch }) {
    dispatch('fetchReviews')
    dispatch('fetchPurchases')
    dispatch('fetchPopUps')
  },
  async fetchReviews({ commit }) {
    let reviews = await this.$axios.$get(`${this.$config.apiUrl}/feedbacks`)
    reviews = reviews.map((item) => ({
      text: item.opinion,
      author: item.fakeAuthor,
    }))
    commit('setReviews', reviews)
  },
  async fetchPurchases({ commit }) {
    let purchases = await this.$axios.$get(`${this.$config.apiUrl}/purchases`)
    purchases = purchases.map((item) => ({ text: item.text }))
    commit('setPurchases', purchases)
  },
  async fetchPopUps({ commit }) {
    let popUps = await this.$axios.$get(`${this.$config.apiUrl}/pop-ups`)
    popUps = popUps.map((item) => ({ imageUrl: item.image.url }))
    commit('setPopUps', popUps)
  },
}

export default {
  state,
  mutations,
  actions,
}
