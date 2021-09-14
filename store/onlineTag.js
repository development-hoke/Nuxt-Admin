import api from '@/api'
import {
  createTree,
  createTreeCache,
  createOptions,
} from '@/utils/dataStructure'

export const state = () => ({
  data: [],
})

export const getters = {
  data: ({ data }) => data,
  sort: ({ data }) => [...data].sort((item1, item2) => item1.sort - item2.sort),
  dict: ({ data }) =>
    data.reduce((dict, item) => {
      return { ...dict, [item.id]: item }
    }, {}),
  treeCache: (state, getters) => createTreeCache(getters.tree),
  find: ({ data }) => (searchId) =>
    data.find(({ id }) => Number(id) === Number(searchId)),
  tree: (state, { sort }) => createTree([...sort]),
  options: ({ data }) => createOptions(data),
}

export const mutations = {
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
    const { data } = await api.onlineTag.fetch(params)

    commit('set', data)
  },

  async create({ commit }, { params }) {
    const { data } = await api.onlineTag.create(params)

    commit('set', data)
  },

  async update({ commit }, { id, params }) {
    const { data } = await api.onlineTag.update(id, params)

    commit('set', data)
  },

  async deleteNode({ commit, getters }, { id }) {
    const { ancestors } = getters.treeCache[id]

    await api.onlineTag.delete(id)

    const targets = (ancestors ? Object.keys(ancestors).concat(id) : [id]).map(
      Number
    )

    targets.forEach((id) => commit('delete', id))
  },
}
