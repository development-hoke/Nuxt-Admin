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
  setMessage(state, message) {
    const order = state.data.find(
      ({ id }) => Number(id) === Number(message.orderId)
    )

    if (!order) {
      return
    }

    const index = order.orderMessages.findIndex(
      ({ id }) => Number(id) === Number(message.id)
    )

    order.orderMessages.splice(
      index >= 0 ? index : order.orderMessages.length,
      1,
      message
    )
  },
}

export const actions = {
  async fetch({ commit }, params = {}) {
    const { data, meta } = await api.order.fetch(params)

    commit('set', data)

    if (params.page !== undefined) {
      meta.currentPage = Number(params.page)
    }

    commit('setPagination', meta)
  },

  async fetchOne({ commit }, { id }) {
    const { data } = await api.order.fetchOne(id)

    commit('setOne', data)
  },

  async cancel({ commit }, { id }) {
    const { data } = await api.order.cancel(id)

    commit('setOne', data)
  },

  async return({ commit }, { id }) {
    const { data } = await api.order.return(id)

    commit('setOne', data)
  },

  async update({ commit }, { id, params }) {
    const { data } = await api.order.update(id, params)

    commit('setOne', data)
  },

  async addCoupon({ commit }, { id, params }) {
    const { data } = await api.order.addCoupon(id, params)

    commit('setOne', data)
  },

  async removeCoupon({ commit }, { id, params }) {
    const { data } = await api.order.removeCoupon(id, params)

    commit('setOne', data)
  },

  async updatePrice({ commit }, { id, params }) {
    const { data } = await api.order.updatePrice(id, params)

    commit('setOne', data)
  },

  async sendMessage({ commit }, { orderId, params }) {
    const { data } = await api.order.sendMessage(orderId, params)

    commit('setMessage', data)
  },
}
