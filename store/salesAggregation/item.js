import api from '@/api'
import * as baseGetters from '@/helper/store/baseGetters'
import * as baseMutations from '@/helper/store/baseMutations'
import * as pagination from '@/helper/store/pagination'

export const state = () => ({
  data: [],
  requestParams: {},
  ...pagination.createState(),
})

export const getters = {
  ...baseGetters,
  pagination: ({ pagination }) => pagination,
  requestParams: ({ requestParams }) => requestParams,
}

export const mutations = {
  ...baseMutations,
  ...pagination.mutations,
  setRequestParams(state, params) {
    state.requestParams = params
  },
}

export const actions = {
  async fetch({ commit }, params = {}) {
    const { data, meta, requestParams } = await api.salesAggregation.fetchItems(
      params
    )

    commit('set', data)

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)

    commit('setRequestParams', requestParams)
  },
}
