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
  async fetch({ commit }, { itemId, params }) {
    const { data, meta } = await api.closedMarket.fetch(itemId, params)

    commit('set', data)

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)
  },

  async create({ commit }, { itemId, params }) {
    const { data } = await api.closedMarket.create(itemId, params)

    commit('setOne', data)
  },

  async update({ commit }, { itemId, id, params }) {
    const { data } = await api.closedMarket.update(itemId, id, params)

    commit('setOne', data)
  },

  async delete({ commit }, { id }) {
    await api.closedMarket.delete(id)

    commit('delete', id)
  },
}
