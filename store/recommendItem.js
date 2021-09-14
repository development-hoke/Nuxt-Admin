import { createDict } from '@/utils/dataStructure'

export const state = () => ({
  data: [],
})

export const getters = {
  data: ({ data }) => data,
  dict: ({ data }) => createDict(data),
}

export const mutations = {
  set(state, data) {
    state.data = data
  },
}
