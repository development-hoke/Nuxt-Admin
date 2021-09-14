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

  delete(state, id) {
    const index = state.data.findIndex((item) => Number(item.id) === Number(id))

    if (index === -1) {
      return
    }

    state.data.splice(index, 1)
  },

  clear(state) {
    state.data = []
  },
}

export const actions = {
  async fetch({ commit }, { eventId, params = {} }) {
    const { data, meta } = await api.eventItem.fetch(eventId, params)

    commit('set', data)

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)
  },

  async create({ commit }, { eventId, params }) {
    const { data } = await api.eventItem.create(eventId, params)

    commit('setOne', data)
  },

  async update({ commit }, { id, eventId, params }) {
    const { data } = await api.eventItem.update(eventId, id, params)

    commit('setOne', data)
  },

  async delete({ commit }, { id, eventId }) {
    await api.eventItem.delete(eventId, id)

    commit('delete', id)
  },
}
