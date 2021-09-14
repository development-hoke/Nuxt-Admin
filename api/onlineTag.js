import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch() {
    return axios.fetch('online_tags/')
  },

  create(payload) {
    return axios.post('online_tags/', payload)
  },

  update(id, payload) {
    return axios.put(`online_tags/${id}/`, payload)
  },

  delete(id) {
    return axios.delete(`online_tags/${id}/`)
  },

  downloadCsv(params = {}) {
    return axios.fetch(
      'online_tags/csv/',
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },
}
