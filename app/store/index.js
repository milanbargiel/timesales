export const state = () => ({
  response: {
    name: null,
    allowRecording: null,
    shortOnTime: null,
    becauseOfCapitalism: null,
    timeType: null,
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
})

export const mutations = {
  setResponse(state, object) {
    // Merge state with given response from object
    state.response = { ...state.response, ...object }
  },
}
