const state = () => ({
  aiConfig: {
    // Set default values that are overwritten by fetchConfigData
    milliSecondsToWait: 5000,
  },
})

const mutations = {
  setGpt2Timeout(state, value) {
    state.aiConfig.milliSecondsToWait = value
  },
}

const actions = {
  fetchConfigData({ commit }) {
    this.$axios.$get(`${this.$config.apiUrl}/config`).then((data) => {
      commit('setGpt2Timeout', data.aiConfig.milliSecondsToWait)
    })
  },
}

export default {
  state,
  mutations,
  actions,
}
