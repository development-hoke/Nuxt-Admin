import api from '@/api'
import * as pagination from '@/helper/store/pagination'
import * as baseGetters from '@/helper/store/baseGetters'
import * as baseMutations from '@/helper/store/baseMutations'

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
  async fetch({ commit }, { id, params = {} }) {
    const { data, meta } = await api.orderDetail.fetchItems(id, params)

    commit('set', data)

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)
  },
}
