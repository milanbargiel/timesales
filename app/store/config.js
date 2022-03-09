const state = () => ({
  milliSecondsToWaitForGpt2: 10000,
})

const mutations = {
  setGpt2Timeout(state, value) {
    state.milliSecondsToWaitForGpt2 = value
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
