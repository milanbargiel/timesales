const getDefaultState = () => {
  return {
    data: {
      id: null, // id in strapi cms
      name: null,
      allowRecording: null,
      shortOnTime: null,
      becauseOfCapitalism: null,
      timePurpose: null,
      timeAmount: null,
      orderSummary: null, // Is generated in checkout from timePurpose and timeAmount
      timePrice: null,
      memberOfChurch: null,
      afraidOfHell: null,
      timeManagementSecret: null,
      readyForInvestment: null,
      projectsToFinish: null,
      prioritizationProblems: null,
      workForUs: null,
      email: null, // Is only set when user wants to work for TSO
    },
  }
}

const state = () => getDefaultState()

const mutations = {
  setResponse(state, object) {
    // Merge state with given response from object
    state.data = { ...state.data, ...object }
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}

const actions = {
  saveResponse({ commit, state }, response) {
    // Save response data in vuex store
    commit('setResponse', response)

    // When user opts in – save data in backend for analysis
    if (state.data.allowRecording) {
      // Update response
      if (state.data.id) {
        this.$axios.put(
          `${this.$config.apiUrl}/responses/${state.data.id}`,
          state.data
        )
      } else {
        // Create response
        this.$axios
          .$post(`${this.$config.apiUrl}/responses`, state.data)
          .then((response) => {
            // Save cms id to local storage
            commit('setResponse', { id: response.id })
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      }
    }
  },
}

export default {
  state,
  mutations,
  actions,
}
