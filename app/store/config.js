const state = () => ({
  milliSecondsToWaitForGpt2: 10000,
})

const mutations = {
  setGpt2Timeout(state) {
    state.milliSecondsToWaitForGpt2 = true
  },
}

const actions = {
  fetchConfigData({ commit, dispatch }) {
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
