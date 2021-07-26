const state = () => ({
  debugMode: false,
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
  toggleDebugMode(state) {
    state.debugMode = !state.debugMode
  },
  setConfig(state, config) {
    state.config = config
  },
}

const actions = {
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
