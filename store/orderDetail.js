import api from '@/api'
import * as baseGetters from '@/helper/store/baseGetters'
import * as baseMutations from '@/helper/store/baseMutations'
import { aggrigate } from '@/utils/dataStructure'

export const state = () => ({
  data: [],
})

export const getters = {
  ...baseGetters,
  orderGroups: ({ data }) => aggrigate(data, 'orderId'),
}

export const mutations = {
  ...baseMutations,
}

export const actions = {
  async fetch({ commit }, { orderId }) {
    const { data } = await api.orderDetail.fetch(orderId)

    commit('set', data)
  },

  async create({ commit }, { orderId, params }) {
    const { data } = await api.orderDetail.create(orderId, params)

    commit('setOne', data)
  },

  async fetchOne({ commit }, { id }) {
    const { data } = await api.orderDetail.fetchOne(id)

    commit('setOne', data)
  },

  async cancel({ commit }, { orderId, params }) {
    const { data } = await api.orderDetail.cancel(orderId, params)

    commit('set', data)
  },

  async return({ commit }, { orderId, params }) {
    const { data } = await api.orderDetail.return(orderId, params)

    commit('set', data)
  },
}
