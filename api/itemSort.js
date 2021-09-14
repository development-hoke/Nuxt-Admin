import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch('item_sorts/', {}, { query: filterQueryParams(params) })
  },

  create(payload) {
    return axios.post('item_sorts/', payload)
  },

  update(id, payload) {
    return axios.put(`item_sorts/${id}/`, payload)
  },

  delete(id) {
    return axios.delete(`item_sorts/${id}/`)
  },
}
