const getDefaultState = () => {
  return {
    data: {
      id: null, // response id in strapi cms
      name: null,
      allowRecording: null,
      shortOnTime: null,
      reasonShortOnTime: null, // aiAnswer component
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
          // eslint-disable-next-line no-console
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
  // Send data to API to create a gpt2 based comment on text
  // Store data in vuex store afterwards
  // Returns a promise
  generateAiComment({ commit, state, rootState }, userInput) {
    return this.$axios
      .put(
        `${this.$config.apiUrl}/generate-ai-comment/${state.data.id}`,
        userInput,
        // Set timeout bases on the threshold set in the strapi cms
        { timeout: rootState.config.milliSecondsToWaitForGpt2 }
      )
      .then((response) => {
        commit('setResponse', response.data)
        return response.data
      })
      .catch(() => {
        // When the requests runs into a timeout or when the gpt2 app is down save the userInput only
        commit('setResponse', userInput)
        return undefined
      })
  },
}

export default {
  state,
  mutations,
  actions,
}
