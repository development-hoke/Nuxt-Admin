import api from '@/api'
import * as pagination from '@/helper/store/pagination'

export const state = () => ({
  data: [],
  ...pagination.createState(),
})

export const getters = {
  data: ({ data }) => data,
  options: ({ data }) =>
    data.map(({ id, name }) => ({
      code: id,
      name,
    })),
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
    const { data, meta } = await api.brand.fetch(params)

    commit('set', data)

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)
  },

  async fetchOne({ commit }, { id }) {
    const { data } = await api.brand.fetchOne(id)

    commit('setOne', data)
  },

  async create({ commit }, { params }) {
    const { data } = await api.brand.create(params)

    commit('setOne', data)
  },

  async update({ commit }, { id, params }) {
    const { data } = await api.brand.update(id, params)

    commit('setOne', data)
  },

  async delete({ commit }, { id }) {
    await api.brand.delete(id)

    commit('delete', id)
  },

  async updateSort({ commit }, { id, params }) {
    const { data } = await api.brand.updateSort(id, params)

    commit('set', data)
  },
}
