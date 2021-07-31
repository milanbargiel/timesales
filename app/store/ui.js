const state = () => ({
  debugMode: false,
  showHeader: true,
  showFooter: true,
})

const mutations = {
  enableDebugMode(state) {
    state.debugMode = true
  },
  showHeader(state) {
    state.showHeader = true
  },
  hideHeader(state) {
    state.showHeader = false
  },
  hideFooter(state) {
    state.showFooter = false
  },
  showFooter(state) {
    state.showFooter = true
  },
}

export default {
  state,
  mutations,
}
