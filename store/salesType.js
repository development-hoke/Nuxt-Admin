import api from '@/api'
import { createOptions } from '@/utils/dataStructure'
import * as pagination from '@/helper/store/pagination'
import * as baseMutations from '@/helper/store/baseMutations'

export const state = () => ({
  data: [],
  ...pagination.createState(),
})

export const getters = {
  data: ({ data }) => data,
  options: ({ data }) => createOptions(data),
  pagination: ({ pagination }) => pagination,
}

export const mutations = {
  ...baseMutations,
  ...pagination.mutations,
}

export const actions = {
  async fetch({ commit }, params = {}) {
    const { data, meta } = await api.salesType.fetch(params)

    commit('set', data)

    if (params.all) {
      return
    }

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)
  },

  async create({ commit }, { params }) {
    const { data } = await api.salesType.create(params)

    commit('setOne', data)
  },

  async update({ commit }, { id, params }) {
    const { data } = await api.salesType.update(id, params)

    commit('setOne', data)
  },

  async delete({ commit }, { id }) {
    await api.salesType.remove(id)

    commit('remove', id)
  },
}
