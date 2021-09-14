import Vue from 'vue'
import api from '@/api'
import * as baseGetters from '@/helper/store/baseGetters'
import * as baseMutations from '@/helper/store/baseMutations'

export const state = () => ({
  data: [],
})

export const getters = {
  ...baseGetters,
  storeBrandDict: ({ data }, { dict }) => {
    return data.reduce((dict, item) => {
      const storeBrand = item.storeBrand ?? -1

      if (!dict[storeBrand]) {
        dict[storeBrand] = {}
      }

      dict[storeBrand][item.itemId] = item

      return dict
    }, {})
  },
}

export const mutations = {
  ...baseMutations,
  resetSort(state) {
    const items = [...state.data]

    items
      .sort((i1, i2) => i1.sort - i2.sort)
      .forEach((item, index) => {
        Vue.set(item, 'sort', index + 1)
      })
  },
}

export const actions = {
  async fetch({ commit }, payload) {
    const { params = {} } = payload

    const { data } = await api.itemSort.fetch(params)

    commit('set', data)
  },

  async create({ commit }, { params }) {
    const { data } = await api.itemSort.create(params)

    commit('append', data)
  },

  async update({ commit }, { id, params }) {
    const { data } = await api.itemSort.update(id, params)

    commit('set', data)
  },

  async delete({ commit, getters }, { id }) {
    await api.itemSort.delete(id)

    const deleting = getters.find(id)

    if (!deleting) {
      return
    }

    commit('remove', id)
    commit('resetSort')
  },
}
