import Vue from 'vue'
import api from '@/api'
import * as baseGetters from '@/helper/store/baseGetters'
import * as baseMutations from '@/helper/store/baseMutations'

const createInitialCursor = () => ({
  currentPage: 0,
  isReachedEnd: false,
})

export const state = () => ({
  data: [],
  cursor: createInitialCursor(),
})

export const getters = {
  ...baseGetters,
  cursor: ({ cursor }) => cursor,
}

export const mutations = {
  ...baseMutations,

  setCurrentPage(state, page) {
    Vue.set(state.cursor, 'currentPage', page)
  },

  setReachedEnd(state, isReachedEnd) {
    Vue.set(state.cursor, 'isReachedEnd', isReachedEnd)
  },
}

export const actions = {
  async fetchCursor({ commit }, { params = {} } = {}) {
    const { data, meta } = await api.styling.fetch(params)
    const page = 1

    const isReachedEnd = page >= meta.lastPage

    commit('set', data)
    commit('setCurrentPage', page)
    commit('setReachedEnd', isReachedEnd)
  },

  async nextPage({ commit, state }, { params = {} } = {}) {
    const { cursor } = state

    if (cursor.isReachedEnd) {
      return
    }

    const page = cursor.currentPage + 1

    const { data, meta } = await api.styling.fetch({ ...params, page })

    commit('append', data)
    commit('setCurrentPage', page)
    commit('setReachedEnd', page >= meta.lastPage)
  },
}
