import api from '@/api'
import * as pagination from '@/helper/store/pagination'

export const state = () => ({
  data: [],
  ...pagination.createState(),
})

export const getters = {
  data: ({ data }) => data,
  find: ({ data }) => (searchId) =>
    data.find(({ id }) => Number(id) === Number(searchId)),
  pagination: ({ pagination }) => pagination,
}

export const mutations = {
  ...pagination.mutations,
  set(state, data) {
    state.data = data
  },

  setOne(state, data) {
    if (state.data.length === 0) {
      state.data.push(data)
      return
    }

    const index = state.data.findIndex(
      (item) => Number(item.id) === Number(data.id)
    )

    if (index === -1) {
      state.data.push(data)
      return
    }

    state.data.splice(index, 1, data)
  },

  clear(state) {
    state.data = []
  },

  delete(state, id) {
    const index = state.data.findIndex((item) => Number(item.id) === Number(id))

    if (index === -1) {
      return
    }

    state.data.splice(index, 1)
  },
}

export const actions = {
  async fetch({ commit }, params = {}) {
    const { data, meta } = await api.information.fetch(params)

    commit('set', data)

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)
  },

  async fetchOne({ commit }, { id }) {
    const { data } = await api.information.fetchOne(id)

    commit('setOne', data)
  },

  async create({ commit }, { params }) {
    const { data } = await api.information.create(params)

    commit('setOne', data)
  },

  async update({ commit }, { id, params }) {
    const { data } = await api.information.update(id, params)

    commit('setOne', data)
  },

  async delete({ commit }, { id }) {
    await api.information.delete(id)

    commit('delete', id)
  },
}
