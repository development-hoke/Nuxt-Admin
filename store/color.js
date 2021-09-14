import api from '@/api'
import { createDict, createOptions } from '@/utils/dataStructure'
import * as pagination from '@/helper/store/pagination'

export const state = () => ({
  data: [],
  ...pagination.createState(),
})

export const getters = {
  data: ({ data }) => data,
  dict: ({ data }) => createDict(data),
  options: ({ data }) => createOptions(data),
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
}

export const actions = {
  async fetch({ commit }, params = {}) {
    const { data, meta } = await api.color.fetch(params)

    commit('set', data)

    if (params.all) {
      return
    }

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)
  },

  async update({ commit }, { id, params }) {
    const { data } = await api.color.update(id, params)

    commit('setOne', data)
  },
}
