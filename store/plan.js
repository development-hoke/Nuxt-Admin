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
  statusDescription: () => (plan) => {
    if (!plan.status) return '非公開'
    if (!plan.periodFrom && !plan.periodTo) return '公開中'
    const periodFrom = new Date(plan.periodFrom)
    const periodTo = new Date(plan.periodTo)
    if (new Date() < periodFrom) return '公開待ち'
    if (new Date() > periodFrom && !plan.periodTo) return '公開中'
    if (periodTo < new Date()) return '公開終了'
    return '公開中'
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

  clear(state) {
    state.data = []
  },

  delete(state, id) {
    const index = state.data.findIndex((item) => Number(item.id) === Number(id))

    if (index === -1) {
      return
    }

    state.data.splice(index, 1)
  },
}

export const actions = {
  async fetch({ commit }, params = {}) {
    const { data, meta } = await api.plan.fetch(params)

    commit('set', data)

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)
  },

  async fetchOne({ commit }, { id }) {
    const { data } = await api.plan.fetchOne(id)

    commit('setOne', data)
  },

  async create({ commit }, { params }) {
    const { data } = await api.plan.create(params)

    commit('setOne', data)
  },

  async update({ commit }, { id, params }) {
    const { data } = await api.plan.update(id, params)

    commit('setOne', data)
  },

  async delete({ commit }, { id }) {
    await api.plan.delete(id)

    commit('delete', id)
  },

  async deleteListItems({ commit }, { id, itemId }) {
    const { data } = await api.plan.deleteListItems(id, itemId)

    commit('setOne', data)
  },

  async createNewItems({ commit }, { id, params }) {
    const { data } = await api.plan.createNewItems(id, params)

    commit('setOne', data)
  },

  async updateItemSetting({ commit }, { id, params }) {
    const { data } = await api.plan.updateItemSetting(id, params)

    commit('setOne', data)
  },

  async fetchByStoreBrand({ commit }, { storeBrand }) {
    const { data } = await api.plan.fetchByStoreBrand(storeBrand)

    commit('set', data)
  },
}
