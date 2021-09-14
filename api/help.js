import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch('helps/', {}, { query: filterQueryParams(params) })
  },

  fetchOne(id) {
    return axios.fetch(`helps/${id}/`)
  },

  create(payload) {
    return axios.post('helps/', payload)
  },

  update(id, payload) {
    return axios.put(`helps/${id}/`, payload)
  },

  delete(id) {
    return axios.delete(`helps/${id}/`)
  },
}
