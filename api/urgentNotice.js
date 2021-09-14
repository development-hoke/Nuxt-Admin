import axios from './axios'

export default {
  fetch() {
    return axios.fetch('urgent_notices/')
  },

  update(id, payload) {
    return axios.put(`urgent_notices/${id}/`, payload)
  },
}
