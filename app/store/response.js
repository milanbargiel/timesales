const getDefaultState = () => {
  return {
    data: {
      id: null, // response id in strapi cms
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
      applicationEmail: null, // Is only set when user wants to work for TSO
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
  postResponse({ commit }, data) {
    // Update response
    if (data.id) {
      this.$axios.put(`${this.$config.apiUrl}/responses/${data.id}`, data)
    } else {
      // Create response
      this.$axios
        .$post(`${this.$config.apiUrl}/responses`, data)
        .then((response) => {
          // Save cms id to local storage
          commit('setResponse', { id: response.id })
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  },
  saveResponse({ commit, state, dispatch }, response) {
    // Save response data in vuex store
    commit('setResponse', response)

    const isApplication = typeof response.applicationEmail !== 'undefined'

    if (state.data.allowRecording || isApplication) {
      dispatch('postResponse', {
        // When user opts in – save data in backend for analysis
        ...(state.data.allowRecording && state.data),
        // Always save e-mail when user wants to work for TSO
        ...(isApplication && {
          workForUs: true,
          applicationEmail: response.applicationEmail,
        }),
      })
    }
  },
}

export default {
  state,
  mutations,
  actions,
}
