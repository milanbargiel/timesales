const getDefaultState = () => {
  return {
    data: {
      name: null,
      allowRecording: null,
      shortOnTime: null,
      becauseOfCapitalism: null,
      timePurpose: null,
      timeAmount: null,
      timePrice: null,
      memberOfChurch: null,
      afraidOfHell: null,
      timeManagementSecret: null,
      readyForInvestment: null,
      projectsToFinish: null,
      prioritizationProblems: null,
      workForTSO: null,
      email: null, // Is only set when user wants to work for TSO
    },
  }
}

const state = getDefaultState()

const mutations = {
  setResponse(state, object) {
    // Merge state with given response from object
    state.data = { ...state.data, ...object }
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}

export default {
  state,
  mutations,
}
