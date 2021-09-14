import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params) {
    return axios.fetch(`sales_type`, {}, { query: filterQueryParams(params) })
  },

  create(params) {
    return axios.post(`sales_type`, params)
  },

  update(id, params) {
    return axios.put(`sales_type/${id}`, params)
  },

  remove(id) {
    return axios.delete(`sales_type/${id}`)
  },

  downloadCsv(params = {}) {
    return axios.fetch(
      'sales_type/csv/',
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },
}
