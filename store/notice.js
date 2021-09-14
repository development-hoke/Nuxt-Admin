export const state = () => ({
  info: [],
  warn: [],
  error: [],
})

export const getters = {
  info: ({ info }) => info,
  warn: ({ warn }) => warn,
  error: ({ error }) => error,
}

export const mutations = {
  push(state, { type, messages }) {
    state[type].push(...(Array.isArray(messages) ? messages : [messages]))
  },

  putMessages(state, { type, messages }) {
    state[type] = messages
  },

  remove(state, { type, index }) {
    state[type].splice(index, 1)
  },

  clear(state, { type }) {
    state[type] = []
  },

  pushInfo(state, messages) {
    state.info.push(...(Array.isArray(messages) ? messages : [messages]))
  },

  pushWarn(state, messages) {
    state.warn.push(...(Array.isArray(messages) ? messages : [messages]))
  },

  pushError(state, messages) {
    state.error.push(...(Array.isArray(messages) ? messages : [messages]))
  },

  putInfo(state, messages) {
    state.info = messages
  },

  putWarn(state, messages) {
    state.warn = messages
  },

  putError(state, messages) {
    state.error = messages
  },

  removeInfo(state, index) {
    state.info.splice(index, 1)
  },

  removeWarn(state, index) {
    state.warn.splice(index, 1)
  },

  removeError(state, index) {
    state.error.splice(index, 1)
  },

  clearInfo(state) {
    state.info = []
  },

  clearWarn(state) {
    state.warn = []
  },

  clearError(state) {
    state.error = []
  },

  clearAll(state) {
    state.info = []
    state.warn = []
    state.error = []
  },
}
