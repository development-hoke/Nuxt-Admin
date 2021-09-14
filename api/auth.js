import axios from './axios'

export default {
  me() {
    return axios.fetch('auth/me/')
  },

  login(payload) {
    return axios.post('auth/login/', payload)
  },

  logout() {
    return axios.post('auth/logout/')
  },

  refresh() {
    return axios.post('auth/refresh/')
  },

  agentLogin(payload) {
    return axios.post('auth/agent_login/', payload)
  },
}
