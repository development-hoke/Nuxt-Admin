import api from '@/api'
import * as baseGetters from '@/helper/store/baseGetters'
import * as baseMutations from '@/helper/store/baseMutations'
import * as pagination from '@/helper/store/pagination'

export const state = () => ({
  data: [],
  ...pagination.createState(),
})

export const getters = {
  ...baseGetters,
  pagination: ({ pagination }) => pagination,
}

export const mutations = {
  ...baseMutations,
  ...pagination.mutations,
}

export const actions = {
  async fetch({ commit }, params = {}) {
    const { data, meta } = await api.adminLog.fetch(params)

    commit('set', data)

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)
  },
}
