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
  async fetch({ commit }) {
    const { data } = await api.itemBulkUpload.fetch()

    commit('set', data)
  },
}
