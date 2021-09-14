import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(itemId, params = {}) {
    return axios.fetch(
      `items/${itemId}/closed_markets/`,
      {},
      { query: filterQueryParams(params) }
    )
  },

  create(itemId, payload) {
    return axios.post(`items/${itemId}/closed_markets/`, payload)
  },

  update(itemId, id, payload) {
    return axios.put(`items/${itemId}/closed_markets/${id}/`, payload)
  },

  delete(id) {
    return axios.delete(`closed_markets/${id}/`)
  },
}
