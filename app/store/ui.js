const state = () => ({
  debugMode: false,
})

const mutations = {
  toggleDebugMode(state) {
    state.debugMode = !state.debugMode
  },
}

export default {
  state,
  mutations,
}
