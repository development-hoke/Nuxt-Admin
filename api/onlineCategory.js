import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch() {
    return axios.fetch('online_categories/')
  },

  create(payload) {
    return axios.post('online_categories/', payload)
  },

  update(id, payload) {
    return axios.put(`online_categories/${id}/`, payload)
  },

  delete(id) {
    return axios.delete(`online_categories/${id}/`)
  },

  downloadCsv(params = {}) {
    return axios.fetch(
      'online_categories/csv/',
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },
}
