import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch('admin_logs/', {}, { query: filterQueryParams(params) })
  },

  downloadCsv(params = {}) {
    return axios.fetch(
      'admin_logs/csv/',
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },
}
