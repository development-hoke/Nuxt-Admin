import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params) {
    return axios.fetch(`colors/`, {}, { query: filterQueryParams(params) })
  },

  update(id, data) {
    return axios.put(`colors/${id}/`, data)
  },

  downloadCsv(params = {}) {
    return axios.fetch(
      'colors/csv/',
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },
}
