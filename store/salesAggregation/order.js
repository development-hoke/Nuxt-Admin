import api from '@/api'
import * as baseGetters from '@/helper/store/baseGetters'
import * as baseMutations from '@/helper/store/baseMutations'
import * as pagination from '@/helper/store/pagination'

export const state = () => ({
  data: [],
  requestParams: {},
  dailyAggregration: [],
  monthlyAggregration: [],
  ...pagination.createState(),
})

export const getters = {
  ...baseGetters,
  dailyAggregration: ({ dailyAggregration }) => {
    return dailyAggregration
  },
  monthlyAggregration: ({ monthlyAggregration }) => {
    return monthlyAggregration
  },
  pagination: ({ pagination }) => pagination,
  requestParams: ({ requestParams }) => {
    return requestParams
  },
}

export const mutations = {
  ...baseMutations,
  ...pagination.mutations,
  setRequestParams(state, params) {
    state.requestParams = params
  },
  setDailyAggregration(state, params) {
    state.dailyAggregration = params
  },
  setMonthlyAggregration(state, params) {
    state.monthlyAggregration = params
  },
}

export const actions = {
  async fetch({ commit }, params = {}) {
    const {
      data,
      meta,
      requestParams,
    } = await api.salesAggregation.fetchOrders(params)

    commit('set', data)

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)

    commit('setRequestParams', requestParams)
  },

  async fetchDailyAggregration({ commit }) {
    const result = await api.salesAggregation.fetchDailyAggregration()
    const lowercaseKeys = (obj) =>
      Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = obj[key]
        return acc
      }, {})
    commit('setDailyAggregration', lowercaseKeys(result))
  },

  async fetchMonthlyAggregration({ commit }) {
    const result = await api.salesAggregation.fetchMonthlyAggregration()
    const lowercaseKeys = (obj) =>
      Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = obj[key]
        return acc
      }, {})
    commit('setMonthlyAggregration', lowercaseKeys(result))
  },
}
