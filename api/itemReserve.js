import axios from './axios'

export default {
  fetchByItemId(itemId) {
    return axios.fetch(`items/${itemId}/reserve/`)
  },

  create(itemId, payload) {
    return axios.post(`items/${itemId}/reserve/`, payload)
  },

  update(itemId, payload) {
    return axios.put(`items/${itemId}/reserve/`, payload)
  },
}
