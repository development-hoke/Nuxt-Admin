import api from '@/api'
import * as baseGetters from '@/helper/store/baseGetters'
import * as baseMutations from '@/helper/store/baseMutations'

export const state = () => ({
  data: [],
  currentPage: 0,
  isReachedEnd: false,
})

export const getters = {
  ...baseGetters,
  currentPage: ({ currentPage }) => currentPage,
  isReachedEnd: ({ isReachedEnd }) => isReachedEnd,
  options: ({ data }) =>
    data.map(({ coupon }) => ({
      code: coupon.id,
      name: coupon.name,
    })),
}

export const mutations = {
  ...baseMutations,
  setCurrentPage(state, page) {
    state.currentPage = page
  },
  setReachedEnd(state, isReachedEnd) {
    state.isReachedEnd = isReachedEnd
  },
}

export const actions = {
  async fetch({ commit, state }, { memberId, params = {} }) {
    const { data } = await api.member.fetchAvailableCoupons(memberId, params)

    const isReachedEnd = data.length === 0

    if (!isReachedEnd) {
      commit('set', data)
      commit('setCurrentPage', 1)
    }

    commit('setReachedEnd', isReachedEnd)
  },

  async nextPage({ commit, state }, { memberId, params = {} }) {
    const { data } = await api.member.fetchAvailableCoupons(memberId, {
      ...params,
      page: state.currentPage + 1,
    })

    const isReachedEnd = data.length === 0

    if (!isReachedEnd) {
      commit('append', data)
      commit('setCurrentPage', state.currentPage + 1)
    }

    commit('setReachedEnd', isReachedEnd)
  },
}
