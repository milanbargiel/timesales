const state = () => ({
  aiConfig: {
    // Set default values that are overwritten by fetchConfigData
    milliSecondsToWait: 5000,
    numberOfWords: 10,
  },
})

const mutations = {
  setGpt2Timeout(state, value) {
    state.aiConfig.milliSecondsToWait = value
  },
  setNumberOfWords(state, value) {
    state.aiConfig.numberOfWords = value
  },
}

const actions = {
  fetchConfigData({ commit }) {
    this.$axios.$get(`${this.$config.apiUrl}/config`).then((data) => {
      commit('setGpt2Timeout', data.aiConfig.milliSecondsToWait)
      commit('setNumberOfWords', data.aiConfig.numberOfWords)
    })
  },
}

export default {
  state,
  mutations,
  actions,
}
