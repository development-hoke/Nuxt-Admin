import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch('pages/', {}, { query: filterQueryParams(params) })
  },

  fetchOne(id) {
    return axios.fetch(`pages/${id}/`)
  },

  create(payload) {
    return axios.post('pages/', payload)
  },

  update(id, payload) {
    return axios.put(`pages/${id}/`, payload)
  },

  copy(id) {
    return axios.post(`pages/${id}/copy/`)
  },

  delete(id) {
    return axios.delete(`pages/${id}/`)
  },
}
