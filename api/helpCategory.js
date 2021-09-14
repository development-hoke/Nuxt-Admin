import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch() {
    return axios.fetch('help_categories/')
  },

  create(payload) {
    return axios.post('help_categories/', payload)
  },

  update(id, payload) {
    return axios.put(`help_categories/${id}/`, payload)
  },

  delete(id) {
    return axios.delete(`help_categories/${id}/`)
  },

  downloadCsv(params = {}) {
    return axios.fetch(
      'help_categories/csv/',
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },
}
