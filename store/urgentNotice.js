import api from '@/api'

export const state = () => ({
  data: [],
})

export const getters = {
  data: ({ data }) => data,
}

export const mutations = {
  set(state, data) {
    state.data = data
  },
  clear(state) {
    state.data = []
  },
}

export const actions = {
  async fetch({ commit }, params = {}) {
    const { data } = await api.urgentNotice.fetch(params)

    commit('set', data)
  },

  async update({ commit }, { id, params }) {
    const { data } = await api.urgentNotice.update(id, params)

    commit('setOne', data)
  },
}
