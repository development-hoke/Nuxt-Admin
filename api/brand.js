import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params) {
    return axios.fetch('brands', {}, { query: filterQueryParams(params) })
  },
  fetchOne(id) {
    return axios.fetch(`brands/${id}/`)
  },

  create(payload) {
    return axios.post('brands/', payload)
  },

  update(id, payload) {
    return axios.put(`brands/${id}/`, payload)
  },

  delete(id) {
    return axios.delete(`brands/${id}/`)
  },

  updateSort(id, payload) {
    return axios.post(`brands/${id}/update_sort`, payload)
  },

  downloadCsv(params = {}) {
    return axios.fetch(
      'brands/csv/',
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },
}
