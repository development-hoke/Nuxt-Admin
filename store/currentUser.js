import Vue from 'vue'
import api from '@/api'
import httpClient from '@/api/axios'
import { ACCESS_TOKEN } from '@/constants/storageKey'

export const state = () => ({
  profile: {},
  accessToken: null,
})

export const getters = {
  profile: ({ profile }) => profile,
  accessToken: ({ accessToken }) =>
    accessToken ?? localStorage.getItem(ACCESS_TOKEN) ?? null,
}

export const mutations = {
  setProfile(state, data) {
    state.profile = data
  },

  setAccessToken(state, { accessToken }) {
    state.accessToken = accessToken
    localStorage.setItem(ACCESS_TOKEN, accessToken)
    httpClient.setAccessToken(accessToken)
  },

  deleteAccessToken(state) {
    Vue.delete(state, 'accessToken')
    localStorage.removeItem(ACCESS_TOKEN)
    httpClient.removeAccessToken()
  },
}

export const actions = {
  async fetch({ commit }) {
    const { data } = await api.auth.me()

    commit('setProfile', data)
  },

  async login({ commit }, payload) {
    const { data } = await api.auth.login(payload)

    commit('setAccessToken', data)
  },

  async logout({ commit }) {
    await api.auth.logout()

    commit('deleteAccessToken')
  },

  async refreshToken({ commit }) {
    const errorOrResponse = await api.auth.refresh()

    if (errorOrResponse.isAxiosError) {
      throw errorOrResponse
    }

    commit('setAccessToken', errorOrResponse.data)
  },
}
