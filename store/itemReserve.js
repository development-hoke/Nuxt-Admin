import api from '@/api'
import * as baseGetters from '@/helper/store/baseGetters'
import * as baseMutations from '@/helper/store/baseMutations'

export const state = () => ({
  data: [],
})

export const getters = {
  ...baseGetters,
}

export const mutations = {
  ...baseMutations,
}

export const actions = {
  async fetchByItemId({ commit }, { itemId }) {
    const { data } = await api.itemReserve.fetchByItemId(itemId)

    commit('setOne', data)
  },

  async create({ commit }, { itemId, params }) {
    const { data } = await api.itemReserve.create(itemId, params)
    commit('item/setReserveText', data, {
      root: true,
    })

    commit('setOne', data)
  },

  async update({ commit }, { itemId, params }) {
    const { data } = await api.itemReserve.update(itemId, params)
    commit('item/setReserveText', data, {
      root: true,
    })

    commit('setOne', data)
  },
}
