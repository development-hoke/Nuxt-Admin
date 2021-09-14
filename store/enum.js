import camelcase from 'camelcase'
import api from '@/api'
import { arr2Kv } from '@/utils'

export const state = () => ({
  enums: {},
})

export const getters = {
  data: ({ enums }) => enums,

  normalized: ({ enums }) =>
    Object.keys(enums).reduce(
      (data, key) => ({
        ...data,
        [camelcase(key.replace('__', '/'))]: enums[key],
      }),
      {}
    ),

  kv: (state, { normalized }) =>
    Object.keys(normalized).reduce(
      (data, key) => ({
        ...data,
        [key]: arr2Kv(normalized[key]),
      }),
      {}
    ),

  vk: (state, { normalized }) =>
    Object.keys(normalized).reduce(
      (data, key) => ({
        ...data,
        [key]: normalized[key].reduce(
          (kv, { value, key }) => ({
            ...kv,
            [value]: key,
          }),
          {}
        ),
      }),
      {}
    ),

  keyLabel: (state, { normalized }) =>
    Object.keys(normalized).reduce(
      (data, key) => ({
        ...data,
        [key]: arr2Kv(normalized[key], {
          valueName: 'label',
        }),
      }),
      {}
    ),

  valueLabel: (state, { normalized }) =>
    Object.keys(normalized).reduce(
      (data, key) => ({
        ...data,
        [key]: normalized[key].reduce(
          (kv, { value, label }) => ({
            ...kv,
            [value]: label,
          }),
          {}
        ),
      }),
      {}
    ),

  options: (state, { normalized }) =>
    Object.keys(normalized).reduce(
      (data, key) => ({
        ...data,
        [key]: normalized[key].map(({ value, label }) => ({
          code: value,
          name: label,
        })),
      }),
      {}
    ),
}

export const mutations = {
  set(state, data) {
    state.enums = data
  },
}

export const actions = {
  async fetch({ commit }) {
    const { data } = await api.master.fetchEnums()

    commit('set', data)
  },
}
