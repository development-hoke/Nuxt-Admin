import axios from './axios'

export default {
  fetchOne(id) {
    return axios.fetch(`delivery_settings/${id}/`)
  },

  update(id, payload) {
    return axios.put(`delivery_settings/${id}/`, payload)
  },
}
