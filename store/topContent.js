import Vue from 'vue'
import api from '@/api'
import * as baseGetters from '@/helper/store/baseGetters'

const createInitialState = () => ({
  storeBrand: null,
  mainVisuals: [],
  newItems: [],
  pickups: [],
  backgroundColor: null,
  features: [],
  news: [],
  stylingSort: null,
  stylings: [],
})

export const state = () => ({
  data: createInitialState(),
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
  set(state, data) {
    state.data = data
  },
  clear(state) {
    state.data = createInitialState()
  },
  removeChild(state, { propName, keyName, keyValue }) {
    /* eslint-disable eqeqeq */
    const index = state.data[propName].findIndex(
      (item) => item[keyName] == keyValue
    )

    state.data[propName].splice(index, 1)
  },
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

    const { data } = await api.topContent.fetch(params)

    commit('set', data[0] ?? {})
  },

  async fetchByStoreBrand({ commit }, { storeBrand }) {
    const { data } = await api.topContent.fetchByStoreBrand(storeBrand)

    commit('set', data)
  },

  async createMainVisuals({ commit }, { id, params }) {
    const { data } = await api.topContent.createMainVisuals(id, params)

    commit('set', data)
  },

  async updateMainVisuals({ commit }, { id, params }) {
    const { data } = await api.topContent.updateMainVisuals(id, params)

    commit('set', data)
  },

  async deleteMainVisuals({ commit }, { id, sort }) {
    await api.topContent.deleteMainVisuals(id, sort)

    commit('removeChild', {
      propName: 'mainVisuals',
      keyName: 'sort',
      keyValue: sort,
    })
  },

  async updateStatusMainVisuals({ commit }, { id, sort, params }) {
    const { data } = await api.topContent.updateStatusMainVisuals(
      id,
      sort,
      params
    )

    commit('set', data)
  },

  async createNewItems({ commit }, { id, params }) {
    const { data } = await api.topContent.createNewItems(id, params)

    commit('set', data)
  },

  async updateNewItems({ commit }, { id, itemId, params }) {
    const { data } = await api.topContent.updateNewItems(id, itemId, params)

    commit('set', data)
  },

  async deleteNewItems({ commit }, { id, itemId }) {
    await api.topContent.deleteNewItems(id, itemId)

    commit('removeChild', {
      propName: 'newItems',
      keyName: 'itemId',
      keyValue: itemId,
    })
  },

  async createPickups({ commit }, { id, params }) {
    const { data } = await api.topContent.createPickups(id, params)

    commit('set', data)
  },

  async updatePickups({ commit }, { id, itemId, params }) {
    const { data } = await api.topContent.updatePickups(id, itemId, params)

    commit('set', data)
  },

  async deletePickups({ commit }, { id, itemId }) {
    await api.topContent.deletePickups(id, itemId)

    commit('removeChild', {
      propName: 'pickups',
      keyName: 'itemId',
      keyValue: itemId,
    })
  },

  async updateBackGroundColor({ commit }, { id, params }) {
    const { data } = await api.topContent.updateBackGroundColor(id, params)

    commit('set', data)
  },

  async updateFeatures({ commit }, { id, params }) {
    const { data } = await api.topContent.updateFeatures(id, params)

    commit('set', data)
  },

  async updateSortFeatures({ commit }, { id, planId, params }) {
    const { data } = await api.topContent.updateSortFeatures(id, planId, params)

    commit('set', data)
  },

  async updateNews({ commit }, { id, params }) {
    const { data } = await api.topContent.updateNews(id, params)

    commit('set', data)
  },

  async updateSortNews({ commit }, { id, planId, params }) {
    const { data } = await api.topContent.updateSortNews(id, planId, params)

    commit('set', data)
  },

  async delete({ commit }, { id, params }) {
    await api.topContent.update(id, params)

    commit('clear')
  },
}
