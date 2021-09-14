import Vue from 'vue'

export const state = () => ({
  pending: false,
  loading: false,
  sessionData: {},
})

export const getters = {
  pending(state) {
    return state.pending
  },
  loading(state) {
    return state.loading
  },
  onlyPending(state) {
    return state.pending && !state.loading
  },
  sessionData: ({ sessionData }) => sessionData,
}

export const mutations = {
  pending(state, value) {
    state.pending = value
  },
  loading(state, value) {
    state.pending = value
    state.loading = value
  },
  setSessionData(state, data) {
    Object.keys(data).forEach((key) => {
      Vue.set(state.sessionData, key, data[key])
    })
  },
  clearSessionData(state, key) {
    Vue.delete(state.sessionData, key)
  },
}
