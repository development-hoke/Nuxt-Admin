import Vue from 'vue'
import api from '@/api'
import * as pagination from '@/helper/store/pagination'

export const state = () => ({
  data: [],
  cursor: {
    currentPage: 0,
    isReachedEnd: false,
  },
  ...pagination.createState(),
})

export const getters = {
  data: ({ data }) => data,
  find: ({ data }) => (searchId) =>
    data.find(({ id }) => Number(id) === Number(searchId)),
  pagination: ({ pagination }) => pagination,
  cursor: ({ cursor }) => cursor,
  reserved: ({ data }) => (searchId) => {
    const item = data.find(({ id }) => Number(id) === Number(searchId))
    if (item)
      return item.reserve ? item.reserve.statusText : item.reserveTextOrg
    else return ''
  },
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

  setReserveText(state, data) {
    const index = state.data.findIndex(
      (item) => Number(item.id) === Number(data.itemId)
    )

    if (index >= 0) {
      // state.data.splice(index, 1, { ...state.data, reserveText: data.statusText })
      state.data[index].reserveText = data.statusText
    }
  },

  clear(state) {
    state.data = []
  },

  append(state, data) {
    state.data.push(...data)
  },

  setCurrentPage(state, page) {
    Vue.set(state.cursor, 'currentPage', page)
  },

  setReachedEnd(state, isReachedEnd) {
    Vue.set(state.cursor, 'isReachedEnd', isReachedEnd)
  },

  delete(state, searchId) {
    const index = state.data.findIndex(
      (item) => Number(item.id) === Number(searchId)
    )
    if (index < 0) {
      return
    }
    state.data.splice(index, 1)
  },
}

export const actions = {
  async fetch({ commit }, params = {}) {
    const { data, meta } = await api.pastItem.fetch(params)

    commit('set', data)

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)
  },

  async fetchCursor({ commit }, payload) {
    const { params = {} } = payload ?? {}

    const { data } = await api.pastItem.fetch(params)

    const isReachedEnd = data.length === 0

    if (!isReachedEnd) {
      commit('set', data)
      commit('setCurrentPage', 1)
    }

    commit('setReachedEnd', isReachedEnd)
  },

  async nextPage({ commit, state }, payload) {
    const { params = {} } = payload ?? {}
    const { cursor } = state

    const { data } = await api.pastItem.fetch({
      ...params,
      page: cursor.currentPage + 1,
    })

    const isReachedEnd = data.length === 0

    if (!isReachedEnd) {
      commit('append', data)
      commit('setCurrentPage', cursor.currentPage + 1)
    }

    commit('setReachedEnd', isReachedEnd)
  },
}
