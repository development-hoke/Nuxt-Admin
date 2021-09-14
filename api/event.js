import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch('events/', {}, { query: filterQueryParams(params) })
  },

  fetchOne(id) {
    return axios.fetch(`events/${id}/`)
  },

  create(payload) {
    return axios.post('events/', payload)
  },

  update(id, payload) {
    return axios.put(`events/${id}/`, payload)
  },

  copy(id) {
    return axios.post(`events/${id}/copy/`)
  },

  delete(id) {
    return axios.delete(`events/${id}/`)
  },
}
